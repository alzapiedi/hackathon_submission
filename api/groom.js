const fs = require('fs');

const data = JSON.parse(fs.readFileSync(__dirname + '/data'));

const groomedData = [];
data.forEach(object => {
  if (groomedData.some(o => o.ObjectID === object.ObjectID)) return console.log(object.Title);
  groomedData.push(object);
});

fs.writeFileSync(__dirname + '/data', JSON.stringify(groomedData));
