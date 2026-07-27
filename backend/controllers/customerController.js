const db = require("../config/db");

exports.getAllCustomers = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, name, phone, created_at FROM users WHERE role = 'customer' ORDER BY created_at DESC",
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
