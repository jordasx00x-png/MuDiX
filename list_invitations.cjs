const Database = require('better-sqlite3');
const db = new Database('database.sqlite');

try {
  const invitations = db.prepare('SELECT id, user_id FROM invitations').all();
  console.log('Invitations in DB:');
  console.log(JSON.stringify(invitations, null, 2));
} catch (err) {
  console.error('Error reading DB:', err);
}
