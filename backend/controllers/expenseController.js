const db = require("../config/db");

exports.getAllExpenses = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM expenses ORDER BY expense_date DESC, id DESC",
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.createExpense = async (req, res) => {
  try {
    const { description, amount, expense_date } = req.body;

    if (!description || !amount || !expense_date) {
      return res.status(400).json({ message: "Semua kolom harus diisi" });
    }

    const [result] = await db.query(
      "INSERT INTO expenses (description, amount, expense_date) VALUES (?, ?, ?)",
      [description, amount, expense_date],
    );

    res.status(201).json({
      id: result.insertId,
      description,
      amount,
      expense_date,
    });
  } catch (error) {
    console.error("Error creating expense:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM expenses WHERE id = ?", [id]);
    res.json({ message: "Pengeluaran berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting expense:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
