const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const path = require("path");

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Initialize Walk-in Queues table
const db = require("./config/db");
db.query(
  `
  CREATE TABLE IF NOT EXISTS walkin_queues (
    id INT AUTO_INCREMENT PRIMARY KEY,
    queue_number INT NOT NULL,
    queue_date DATE NOT NULL,
    status ENUM('waiting', 'completed', 'cancelled') DEFAULT 'waiting',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`,
)
  .then(() => console.log("walkin_queues table is ready"))
  .catch((err) => console.error("Error creating queues table:", err));

// Initialize Expenses table
db.query(
  `
  CREATE TABLE IF NOT EXISTS expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    description VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    expense_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`
)
  .then(() => console.log("expenses table is ready"))
  .catch((err) => console.error("Error creating expenses table:", err));

// Initialize Products table
db.query(
  `
  CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock INT DEFAULT 0,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`
)
  .then(() => {
    console.log("products table is ready");
    // Also ensure reservations has product_id column
    return db.query("ALTER TABLE reservations ADD COLUMN product_id INT NULL DEFAULT NULL");
  })
  .then(() => console.log("Added product_id to reservations"))
  .catch((err) => {
    if (err.code !== 'ER_DUP_FIELDNAME') {
      console.error("Error altering reservations table:", err);
    }
  })
  .then(() => {
    // Add image_url to products if it doesn't exist
    return db.query("ALTER TABLE products ADD COLUMN image_url VARCHAR(255) NULL DEFAULT NULL");
  })
  .then(() => console.log("Added image_url to products"))
  .catch((err) => {
    if (err.code !== 'ER_DUP_FIELDNAME') {
      console.error("Error creating products table or altering products:", err);
    }
  });


// Import cache middleware
const {
  cacheMiddleware,
  clearCacheOnMutation,
} = require("./middlewares/cacheMiddleware");

// Apply Global Cache Mutation Clearing
app.use(clearCacheOnMutation);

// Apply Global Caching for GET requests (60 seconds)
app.use(cacheMiddleware(60));

// Routes
const serviceRoutes = require("./routes/serviceRoutes");
const kapsterRoutes = require("./routes/kapsterRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const authRoutes = require("./routes/authRoutes");
const customerRoutes = require("./routes/customerRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const memberRoutes = require("./routes/memberRoutes");
const queueRoutes = require("./routes/queueRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const productRoutes = require("./routes/productRoutes");

app.use("/api/services", serviceRoutes);
app.use("/api/kapsters", kapsterRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/queues", queueRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/products", productRoutes);

// Simple root route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Barbershop POS API" });
});

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production' || process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });
}

module.exports = app;
