const fs = require('fs');
const emojiData = require('./emoji.json');
const popularity = JSON.parse(fs.readFileSync(__dirname + '/popularity'));

const popularTags = popularity.map(str => str.split('-')[0].trim());

const result = {};
popularTags.forEach(tag => {
  result[tag] = [];
  emojiData.forEach(emoji => {
    if (!emoji.emoji) return;
    if (emoji.description === tag || emoji.aliases.includes(tag) || emoji.tags.includes(tag)) result[tag].push(emoji.emoji);
  });
  if (result[tag].length === 0) delete result[tag];
});
console.log(result);

fs.writeFileSync(__dirname + '/topEmojis', JSON.stringify(result))
