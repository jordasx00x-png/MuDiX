import Database from 'better-sqlite3';

try {
  const db = new Database('database.sqlite');
  const users = db.prepare('SELECT id, email, name, password FROM users').all();
  console.log(JSON.stringify(users, null, 2));
} catch (e) {
  console.error(e);
}
