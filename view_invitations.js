import Database from 'better-sqlite3';

try {
  const db = new Database('database.sqlite');
  const invitations = db.prepare('SELECT * FROM invitations').all();
  console.log(JSON.stringify(invitations, null, 2));
} catch (e) {
  console.error(e);
}
