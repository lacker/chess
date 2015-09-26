let r = require('rethinkdbdash')();

// Display stuff from the chat
r.table('Message').run({cursor: true}).then((cursor) => {
  cursor.each((err, message) => {
    if (message) {
      console.log(message.content);
    }
  });
});

// Typing stuff in should create
