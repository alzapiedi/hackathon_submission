const bodyParser = require('body-parser');
const constants = require('./constants.js');
const cors = require('cors');
const express = require('express');
const fs = require('fs');
const superagent = require('superagent');

const server = express();
server.use(cors());

const profanities = JSON.parse(fs.readFileSync(__dirname + '/profanityfilter'));
const data = JSON.parse(fs.readFileSync(__dirname + '/data'));
const objectIdsByTagName = JSON.parse(fs.readFileSync(__dirname + '/objectIdsByTagName'));
const popular = JSON.parse(fs.readFileSync(__dirname + '/popular'));

server.get('/', (req, res) => {
  res.send('Hello from the other side');
});

server.get('/data', (req, res) => {
  res.json(data);
});

server.get('/all-tags', (req, res) => {
  const keys = Object.keys(objectIdsByTagName);
  res.json(keys.sort());
});

server.get('/popular', (req, res) => {
  res.json(popular);
});

server.get('/find', (req, res) => {
  res.json(objectIdsByTagName[req.query.tag])
});

server.post('/add-tag', bodyParser.json(), (req, res) => {
  if (!req.body || !req.body.objectId || !req.body.tag) return res.status(422).end();

  const { objectId, tag } = req.body;
  const object = data.find(obj => obj.ObjectID === objectId);
  if (!object) return res.status(404);
  if (profanities.some(word => word.indexOf(tag.toLowerCase()) > -1)) return res.status(501).end();
  if (object.SocialTags && object.SocialTags.includes(tag)) return res.status(409).end();
  object.SocialTags ? object.SocialTags.push(tag) : object.SocialTags = [tag];
  fs.writeFileSync(__dirname + '/data', JSON.stringify(data));
  superagent.get(`https://www.philamuseum.org/collections/folksonomy_ajax.php?ObjectID=${objectId}&req_userInput=${tag}`)
    .then(r => console.log(r.status));
  res.json(object).status(200);
});

server.get('/tour', (req, res) => {
  const { classifications, countries, tags } = req.query;
  const matches = getMatches(classifications, countries, tags);
  const tour = buildTour(matches);
  res.json(tour);
});

server.get('/tags', (req, res) => {
  const { classifications, countries } = req.query;
  console.log(classifications, countries)
  const tags = getTags(classifications, countries);
  res.json(tags);
});

function buildTour(matches) {
  const tour = {};
  matches.forEach(match => {
    const gallery = match.object.Location.GalleryShort;
    if (gallery.indexOf('Gallery') !== 0) return;
    if (!tour[gallery]) tour[gallery] = { objects: [], tagMatches: [], locationMatches: [], classificationMatches: [] };
    tour[gallery].objects.push(match.object);
    match.tagMatches.forEach(tag => tour[gallery].tagMatches.includes(tag) ? null : tour[gallery].tagMatches.push(tag));
    match.locationMatches.forEach(location => tour[gallery].locationMatches.includes(location) ? null : tour[gallery].locationMatches.push(location));
    if (!tour[gallery].classificationMatches.includes(match.object.Classification)) tour[gallery].classificationMatches.push(match.object.Classification);
  });
  return tour;
}

function getTags(classifications, countries) {
  const result = [];
  const histogram = {};
  data.forEach(object => {
    const locationMatches = getLocationMatches(countries, object.Geography);
    const andOne = classifications.includes(object.Classification) ? 1 : 0;
    const numMatches = locationMatches.length + andOne;
    if (numMatches > 0 && object.SocialTags) {
      object.SocialTags.forEach(tag => {
        if (histogram[tag] >= numMatches) return;
        histogram[tag] = numMatches;
        result.push({ tag, numMatches });
      });
    }
  });
  result.sort((a, b) => {
    if (a.numMatches > b.numMatches) return -1;
    if (a.numMatches < b.numMatches) return 1;
    return 0;
  });
  return result.slice(0, 32);
}

function getMatches(classifications, countries, tags) {
  console.log(classifications, countries, tags);
  const result = [];
  data.forEach(object => {
    if (!classifications.includes(object.Classification)) return;
    let tagMatches = [];
    let locationMatches = [];
    if (object.SocialTags && tags) tagMatches = getOverlap(tags, object.SocialTags);
    if (object.Geography && countries) locationMatches = getLocationMatches(countries, object.Geography);
    if (tagMatches.length === 0 && locationMatches.length === 0) return;
    result.push({
      object,
      tagMatches,
      locationMatches,
      numMatches: tagMatches.length + locationMatches.length
    });
  });
  return result.sort((a, b) => {
    if (a.numMatches > b.numMatches) return -1;
    if (a.numMatches < b.numMatches) return 1;
    return 0;
  });
}

function getOverlap(arr1, arr2) {
  const result = [];
  arr1.forEach(el => arr2.includes(el) ? result.push(el) : null);
  return result;
}

function getLocationMatches(countries, location) {
  const result = [];
  countries.forEach(country => location && location.indexOf(country) > -1 ? result.push(country) : null);
  return result;
}

function getClassificationMatches(classifications) {
  const result = [];
  classifications.forEach(classifications => classifications.includes(object.Classification) ? result.push(object) : null);
  return result;
}

function shuffle(a) {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
  }
  return a;
}

server.listen(process.env.PORT || 9000);
