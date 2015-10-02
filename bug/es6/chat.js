let r = require('rethinkdbdash')();
let readline = require('readline');

let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


// Display stuff from the chat
r.table('Message').changes().run().then((cursor) => {
  cursor.each((err, change) => {
    let message = change.new_val;
    if (message) {
      console.log(message.content, message.time);
    }
  });
});

// Typing stuff in should create a new message
rl.on('line', (content) => {
  let time = new Date();
  r.table('Message').insert({content, time}).run().done();
});

// TODO: make live-listening work
