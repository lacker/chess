let r = require('rethinkdbdash')();

r.table('Message').run({cursor: true}).then((cursor) => {
  cursor.each(console.log);
});
