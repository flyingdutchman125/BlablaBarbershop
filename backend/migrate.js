const mysql = require("mysql2/promise");
require("dotenv").config();

async function run() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
  });

  try {
    await connection.query("ALTER TABLE products ADD COLUMN points INT DEFAULT 0 AFTER stock");
    console.log("Added points to products");
  } catch (e) { console.log(e.message); }

  try {
    await connection.query("ALTER TABLE services ADD COLUMN points INT DEFAULT 0 AFTER duration_minutes");
    console.log("Added points to services");
  } catch (e) { console.log(e.message); }

  await connection.end();
}
run();
