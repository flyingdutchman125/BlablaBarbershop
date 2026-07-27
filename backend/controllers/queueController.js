const db = require("../config/db");

exports.createQueue = async (req, res) => {
  try {
    const todayDate = new Date();
    // Gunakan offset timezone lokal agar resetnya tepat jam 00:00 (bukan jam 07:00 WIB)
    const today = new Date(
      todayDate.getTime() - todayDate.getTimezoneOffset() * 60000,
    )
      .toISOString()
      .split("T")[0];

    // Cari antrian terakhir hari ini
    const [rows] = await db.query(
      "SELECT queue_number FROM walkin_queues WHERE queue_date = ? ORDER BY queue_number DESC LIMIT 1",
      [today],
    );

    let nextQueueNumber = 1;
    if (rows.length > 0) {
      nextQueueNumber = rows[0].queue_number + 1;
    }

    const [result] = await db.query(
      'INSERT INTO walkin_queues (queue_number, queue_date, status) VALUES (?, ?, "waiting")',
      [nextQueueNumber, today],
    );

    res.status(201).json({
      message: "Antrian berhasil dibuat",
      queue_id: result.insertId,
      queue_number: nextQueueNumber,
    });
  } catch (error) {
    console.error("Error creating queue:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getActiveQueues = async (req, res) => {
  try {
    const todayDate = new Date();
    const today = new Date(
      todayDate.getTime() - todayDate.getTimezoneOffset() * 60000,
    )
      .toISOString()
      .split("T")[0];
    const [rows] = await db.query(
      'SELECT * FROM walkin_queues WHERE queue_date = ? AND status = "waiting" ORDER BY queue_number ASC',
      [today],
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching queues:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.completeQueue = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query(
      'UPDATE walkin_queues SET status = "completed" WHERE id = ?',
      [id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Antrian tidak ditemukan" });
    }

    res.json({ message: "Antrian diselesaikan" });
  } catch (error) {
    console.error("Error updating queue:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
