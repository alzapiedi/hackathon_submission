const fs = require('fs');

const objectIdsByTagName = JSON.parse(fs.readFileSync(__dirname + '/objectIdsByTagName'));
const tags = Object.keys(objectIdsByTagName);

const sorted = tags.sort((a, b) => {
  if (objectIdsByTagName[a].length > objectIdsByTagName[b].length) return -1;
  if (objectIdsByTagName[a].length < objectIdsByTagName[b].length) return 1;
  return 0;
});

const popular = [];

for (let i = 0; i < 250; i++) {
  popular.push({ tag: sorted[i], count: objectIdsByTagName[sorted[i]].length });
}

fs.writeFileSync(__dirname + '/popular', JSON.stringify(popular))
