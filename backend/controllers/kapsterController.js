const db = require("../config/db");

exports.getAllKapsters = async (req, res) => {
  try {
    let query = "SELECT * FROM kapsters";
    if (req.query.all !== "true") {
      query += " WHERE status = 'active'";
    }
    const [rows] = await db.query(query);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getKapsterById = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM kapsters WHERE id = ?", [
      req.params.id,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Kapster not found" });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.createKapster = async (req, res) => {
  try {
    const { name, bio, status } = req.body;
    let photo_url = req.body.photo_url || "";
    if (req.file) {
      photo_url = `/uploads/${req.file.filename}`;
    }
    const [result] = await db.query(
      "INSERT INTO kapsters (name, bio, photo_url, status) VALUES (?, ?, ?, ?)",
      [name, bio, photo_url, status || "active"],
    );
    res
      .status(201)
      .json({ id: result.insertId, message: "Kapster created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.updateKapster = async (req, res) => {
  try {
    const { name, bio, status } = req.body;
    let photo_url = req.body.photo_url;
    if (req.file) {
      photo_url = `/uploads/${req.file.filename}`;
    }
    const [result] = await db.query(
      "UPDATE kapsters SET name = ?, bio = ?, photo_url = COALESCE(?, photo_url), status = ? WHERE id = ?",
      [name, bio, photo_url, status, req.params.id],
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Kapster not found" });
    }
    res.json({ message: "Kapster updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.deleteKapster = async (req, res) => {
  try {
    // Instead of hard delete, maybe just delete if no reservations, but for now we'll do hard delete.
    const [result] = await db.query("DELETE FROM kapsters WHERE id = ?", [
      req.params.id,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Kapster not found" });
    }
    res.json({ message: "Kapster deleted successfully" });
  } catch (error) {
    console.error(error);
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      return res
        .status(400)
        .json({
          message:
            "Tidak dapat menghapus kapster karena masih terikat dengan reservasi",
        });
    }
    res.status(500).json({ message: "Server Error" });
  }
};
