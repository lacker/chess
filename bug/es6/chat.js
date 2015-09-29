let r = require('rethinkdbdash')();
let readline = require('readline');

let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


// Display stuff from the chat
r.table('Message').run({cursor: true}).then((cursor) => {
  cursor.each((err, message) => {
    if (message) {
      console.log(message.content);
    }
  });
});

// Typing stuff in should create a new message
rl.on('line', (content) => {
  console.log('inserting ' + content);
  r.table('Message').insert({content}).run().done();
});

// TODO: sort by time, make the display stuff listen for liveness
