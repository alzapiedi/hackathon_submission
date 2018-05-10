// BUILDS A MAP OF ALL TAG NAMES
// KEY => TAGNAME, VALUE => ARRAY OF OBJECT ID

const fs = require('fs');

const objectIdsByTagName = {};

str = fs.readFileSync(__dirname + '/data');
arr = JSON.parse(str);

arr.forEach(object => {
  const tags = object.SocialTags;
  if (!tags) return;
  tags.forEach(tag => {
    if (!objectIdsByTagName[tag]) objectIdsByTagName[tag] = [];
    objectIdsByTagName[tag].push(object.ObjectID);
  });
});

Object.keys(objectIdsByTagName).forEach(tag => console.log(tag));
console.log(`Total - ${Object.keys(objectIdsByTagName).length}`)

fs.writeFileSync(__dirname + '/objectIdsByTagName', JSON.stringify(objectIdsByTagName));
