import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const db = new Database('database.sqlite');

async function seed() {
  try {
    const users = [
      { email: 'admin@example.com', password: 'password123', name: 'Admin User' },
      { email: 'user@example.com', password: 'password123', name: 'Regular User' },
      { email: 'test@example.com', password: 'password123', name: 'Test User' }
    ];

    for (const user of users) {
      const existingUser = db.prepare('SELECT * FROM users WHERE email = ?').get(user.email);
      
      if (!existingUser) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        const id = crypto.randomUUID();
        const picture = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`;

        const stmt = db.prepare(`
          INSERT INTO users (id, email, name, picture, password) 
          VALUES (?, ?, ?, ?, ?)
        `);
        
        stmt.run(id, user.email, user.name, picture, hashedPassword);
        console.log(`Created user: ${user.email} with password: ${user.password}`);
      } else {
        console.log(`User already exists: ${user.email}`);
      }
    }
    
    console.log('Database seeded successfully.');
  } catch (e) {
    console.error('Error seeding database:', e);
  }
}

seed();
