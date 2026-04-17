import Database from 'better-sqlite3';
const db = new Database('database.sqlite');
try {
  const invitations = db.prepare('SELECT id, user_id FROM invitations').all();
  console.log('Invitations in DB:', JSON.stringify(invitations, null, 2));
} catch (e) {
  console.error('Error reading DB:', e);
}
