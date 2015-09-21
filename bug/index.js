var bodyParser = require('body-parser');
var express = require('express');
var r = require('rethinkdb');

var app = express();

app.get('/', function (request, response) {
  r.connect({ host: 'localhost', port: 28015 }, function(err, conn) {
    if (err) {
      throw err;
    }
    r.db('dev').tableCreate('Message').run(conn, function(err, result) {
      if (err) {
        throw err;
      }
      console.log(result);
      r.table('Message').insert({content: 'sup world'}).run(
        conn,
        function(err, result) {
          if (err) {
            throw err;
          }
          console.log(result);
          response.send("Got to the center of the nest");
        });
    });
  });
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
