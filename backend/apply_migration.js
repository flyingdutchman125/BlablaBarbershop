const db = require("./config/db");

async function migrate() {
  try {
    console.log("Creating members table...");
    await db.query(`
      CREATE TABLE IF NOT EXISTS members (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL UNIQUE,
        birth_date DATE,
        points INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("Inserting new services...");
    await db.query(`
      INSERT IGNORE INTO services (name, description, price, duration_minutes, image_url) VALUES 
      ('Casual Service', 'Potong rambut casual standard', 25000.00, 30, 'https://placehold.co/300/1e1e1e/d4af37?text=Casual+Service'),
      ('Clean Service', 'Potong rambut clean cut, rapi dan segar', 30000.00, 35, 'https://placehold.co/300/1e1e1e/d4af37?text=Clean+Service'),
      ('Grooming Service', 'Potong rambut + cuci + massage + premium pomade', 50000.00, 45, 'https://placehold.co/300/1e1e1e/d4af37?text=Grooming+Service'),
      ('Registrasi Member', 'Pendaftaran member baru BLABLA BARBER', 100000.00, 0, 'https://placehold.co/300/1e1e1e/d4af37?text=Member')
    `);

    console.log("Migration completed successfully.");
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
}

migrate();
