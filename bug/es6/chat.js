let r = require('rethinkdbdash')();
let readline = require('readline');

let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


// Display stuff from the chat
r.table('Message').orderBy('time').run({cursor: true}).then((cursor) => {
  cursor.each((err, message) => {
    if (message) {
      console.log(message.content, message.time);
    }
  });
});

// Typing stuff in should create a new message
rl.on('line', (content) => {
  let time = new Date();
  console.log('inserting ' + content);
  r.table('Message').insert({content, time}).run().done();
});

// TODO: make live-listening work
