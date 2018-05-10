const fs = require('fs');
const constants = require('./constants.js');

const data = JSON.parse(fs.readFileSync(__dirname + '/data'));

const histogram = {};

function byCountry() {
  data.forEach(object => {
    const country = constants.countries.find(c => object.Geography && object.Geography.indexOf(c) > -1);
    if (country) histogram[country] ? histogram[country]++ : histogram[country] = 1;
  });
  console.log(Object.keys(histogram).reduce((acc, el) => acc += histogram[el], 0));
}

function byGallery() {
  data.forEach(o => {
    if (!histogram[o.Location.GalleryShort]) histogram[o.Location.GalleryShort] = 0;
    histogram[o.Location.GalleryShort]++;
  });
}

function byClassification() {
  data.forEach(o => {
    if (!histogram[o.Classification]) histogram[o.Classification] = 0;
    histogram[o.Classification]++;
  });
  console.log(Object.keys(histogram).reduce((acc, el) => acc += histogram[el], 0));
}

// byClassification();
//
// console.log(Object.keys(histogram));
console.log(data.length)
console.log(Math.max.apply(null, data.filter(o => o.Style).map(o => o.Style.length)))
