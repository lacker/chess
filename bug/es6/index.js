let bodyParser = require('body-parser');
let express = require('express');
let r = require('rethinkdbdash')();

let app = express();

let db = {
  host: 'localhost',
  post: 28015
}

// Posting to /message creates a new message
app.post('/message', (request, response) => {
  // TODO: implement
});

// Going to /sup creates a sup message
app.get('/sup', (request, response) => {
  let content = 'sup world ' + Math.floor(Math.random() * 1000);
  r.table('Message').insert({content}).run((err, result) => {
    if (err) {
      throw err;
    }
    response.send('added: ' + content);
  });
});

let server = app.listen(3000, () => {
  let host = server.address().address;
  let port = server.address().port;
  
  console.log('Example app listening at http://%s:%s', host, port);
});
