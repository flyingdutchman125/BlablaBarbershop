const db = require("../config/db");

exports.registerMember = async (req, res) => {
  try {
    const { name, phone, birth_date } = req.body;

    if (!name || !phone || !birth_date) {
      return res
        .status(400)
        .json({ message: "Name, phone, and birth_date are required" });
    }

    const [existing] = await db.query(
      "SELECT id FROM members WHERE phone = ?",
      [phone],
    );
    if (existing.length > 0) {
      return res
        .status(400)
        .json({ message: "Phone number already registered as member" });
    }

    const [result] = await db.query(
      "INSERT INTO members (name, phone, birth_date) VALUES (?, ?, ?)",
      [name, phone, birth_date],
    );

    res.status(201).json({
      message: "Member registered successfully",
      member_id: result.insertId,
    });
  } catch (error) {
    console.error("Error registering member:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getMemberByPhone = async (req, res) => {
  try {
    const { phone } = req.params;
    const [members] = await db.query("SELECT * FROM members WHERE phone = ?", [
      phone,
    ]);

    if (members.length === 0) {
      return res.status(404).json({ message: "Member not found" });
    }

    res.status(200).json(members[0]);
  } catch (error) {
    console.error("Error fetching member:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getAllMembers = async (req, res) => {
  try {
    const [members] = await db.query(
      "SELECT * FROM members ORDER BY created_at DESC",
    );
    res.status(200).json(members);
  } catch (error) {
    console.error("Error fetching members:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.deleteMember = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM members WHERE id = ?", [id]);
    res.status(200).json({ message: "Member deleted successfully" });
  } catch (error) {
    console.error("Error deleting member:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
