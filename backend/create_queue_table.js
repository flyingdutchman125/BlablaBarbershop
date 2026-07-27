const db = require("./config/db");

async function createTable() {
  try {
    console.log("Creating walkin_queues table...");
    await db.query(`
      CREATE TABLE IF NOT EXISTS walkin_queues (
        id INT AUTO_INCREMENT PRIMARY KEY,
        queue_number INT NOT NULL,
        queue_date DATE NOT NULL,
        status ENUM('waiting', 'completed', 'cancelled') DEFAULT 'waiting',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("walkin_queues table created successfully.");
    process.exit(0);
  } catch (err) {
    console.error("Failed to create table:", err);
    process.exit(1);
  }
}

createTable();
