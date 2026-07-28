const db = require("../config/db");

exports.getAllServices = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM services");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getServiceById = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM services WHERE id = ?", [
      req.params.id,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.createService = async (req, res) => {
  try {
    const { name, description, price, duration_minutes } = req.body;
    let image_url = req.body.image_url || "";
    if (req.file) {
      image_url = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
    }
    const [result] = await db.query(
      "INSERT INTO services (name, description, price, duration_minutes, image_url) VALUES (?, ?, ?, ?, ?)",
      [name, description, price, duration_minutes, image_url],
    );
    res
      .status(201)
      .json({ id: result.insertId, message: "Service created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.updateService = async (req, res) => {
  try {
    const { name, description, price, duration_minutes } = req.body;
    let image_url = req.body.image_url;
    if (req.file) {
      image_url = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
    }
    const [result] = await db.query(
      "UPDATE services SET name = ?, description = ?, price = ?, duration_minutes = ?, image_url = COALESCE(?, image_url) WHERE id = ?",
      [name, description, price, duration_minutes, image_url, req.params.id],
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.json({ message: "Service updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const [result] = await db.query("DELETE FROM services WHERE id = ?", [
      req.params.id,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.json({ message: "Service deleted successfully" });
  } catch (error) {
    console.error(error);
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      return res
        .status(400)
        .json({
          message:
            "Tidak dapat menghapus layanan karena masih terikat dengan reservasi",
        });
    }
    res.status(500).json({ message: "Server Error" });
  }
};
