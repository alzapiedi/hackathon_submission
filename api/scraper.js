const superagent = require('superagent');

const url = 'https://hackathon.philamuseum.org/api/v0/collection/objectsOnView';
const api_token = 'IVRAdFDmzJDvHt0sOhH1YtzufDBw54F0wKRdVg0p1htmQGiZDS7UtozRC1bF';

const limit = 100;
let offset = 0;
let finished = false;

const data = [];

function get() {
  console.log(`Requesting: LIMIT ${limit} - OFFSET ${offset}`);
  superagent.get(url)
  .query({ limit, offset, api_token })
  .then(handleResponse);
}

function handleResponse(response) {
  if (!response.body.length) return writeData();
  offset += limit;
  response.body.forEach(e => data.push(e));
  writeData();
  get();
}

function writeData() {
  fs.writeFileSync(__dirname + '/data', JSON.stringify(data));
}

// get(); 
