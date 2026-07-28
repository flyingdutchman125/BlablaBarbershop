const db = require("../config/db");

exports.getAllProducts = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM products ORDER BY name ASC");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, price, stock } = req.body;
    let image_url = req.body.image_url || "";
    if (req.file) {
      image_url = `/uploads/${req.file.filename}`;
    }
    const [result] = await db.query(
      "INSERT INTO products (name, price, stock, image_url) VALUES (?, ?, ?, ?)",
      [name, price, stock || 0, image_url],
    );
    res.status(201).json({ id: result.insertId, name, price, stock, image_url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, stock } = req.body;
    let image_url = req.body.image_url;
    if (req.file) {
      image_url = `/uploads/${req.file.filename}`;
    }
    await db.query(
      "UPDATE products SET name = ?, price = ?, stock = ?, image_url = COALESCE(?, image_url) WHERE id = ?",
      [name, price, stock, image_url, id],
    );
    res.json({ message: "Product updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM products WHERE id = ?", [id]);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
