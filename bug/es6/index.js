var bodyParser = require('body-parser');
var express = require('express');
var r = require('rethinkdb');

var app = express();

// Going to /sup creates a sup message
app.get('/sup', (request, response) => {
  r.connect({ host: 'localhost', port: 28015 }).then((conn) => {
    var content = 'sup world ' + Math.floor(Math.random() * 1000);
    r.db('test').table('Message').insert({content}).run(
      conn, (err, result) => {
        if (err) {
          throw err;
        }
        response.send('added: ' + content);
      });
  }).error((err) => {
    console.log('error', err);
    response.send('error: ' + err);
  });
});

var server = app.listen(3000, () => {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
