const db = require("../config/db");
const crypto = require("crypto");

exports.getAllReservations = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT r.*, 
        COALESCE(u.name, 'Walk-in Customer') as customer_name, 
        COALESCE(u.phone, CASE 
          WHEN r.ticket_code LIKE 'WLK-%-%' THEN CONCAT('Antrian ', SUBSTRING_INDEX(SUBSTRING_INDEX(r.ticket_code, '-', 2), '-', -1))
          ELSE '-' 
        END) as phone, 
        COALESCE(k.name, '-') as kapster_name, 
        COALESCE(s.name, p.name) as service_name, 
        COALESCE(s.price, p.price) as price,
        t.created_at as transaction_date,
        t.payment_method,
        CASE WHEN r.product_id IS NOT NULL THEN 'product' ELSE 'service' END as item_type
      FROM reservations r
      LEFT JOIN users u ON r.customer_id = u.id
      LEFT JOIN kapsters k ON r.kapster_id = k.id
      LEFT JOIN services s ON r.service_id = s.id
      LEFT JOIN products p ON r.product_id = p.id
      LEFT JOIN transactions t ON t.id = r.transaction_id OR t.reservation_id = r.id
      ORDER BY r.created_at DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getTodayReservations = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0]; // format YYYY-MM-DD
    const [rows] = await db.query(`
      SELECT r.*, 
        COALESCE(u.name, 'Walk-in Customer') as customer_name, 
        COALESCE(u.phone, CASE 
          WHEN r.ticket_code LIKE 'WLK-%-%' THEN CONCAT('Antrian ', SUBSTRING_INDEX(SUBSTRING_INDEX(r.ticket_code, '-', 2), '-', -1))
          ELSE '-' 
        END) as phone, 
        COALESCE(k.name, '-') as kapster_name, 
        COALESCE(s.name, p.name) as service_name, 
        COALESCE(s.price, p.price) as price,
        t.created_at as transaction_date,
        t.payment_method,
        CASE WHEN r.product_id IS NOT NULL THEN 'product' ELSE 'service' END as item_type
      FROM reservations r
      LEFT JOIN users u ON r.customer_id = u.id
      LEFT JOIN kapsters k ON r.kapster_id = k.id
      LEFT JOIN services s ON r.service_id = s.id
      LEFT JOIN products p ON r.product_id = p.id
      LEFT JOIN transactions t ON t.id = r.transaction_id OR t.reservation_id = r.id
      WHERE r.booking_date = ?
      ORDER BY r.booking_time ASC
    `, [today]);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.createReservation = async (req, res) => {
  try {
    const {
      customer_name,
      customer_phone,
      kapster_id,
      service_id,
      booking_date,
      booking_time,
    } = req.body;

    // Cari apakah pelanggan dengan nomor HP ini sudah ada
    let [users] = await db.query("SELECT id FROM users WHERE phone = ?", [
      customer_phone,
    ]);
    let customer_id = null;

    if (users.length > 0) {
      customer_id = users[0].id;
    } else {
      // Jika belum ada, buat user baru (sebagai guest)
      // Password dibuat random/dummy karena mereka tidak perlu login
      const dummyPassword = crypto.randomBytes(8).toString("hex");
      const [newUser] = await db.query(
        "INSERT INTO users (name, phone, password, role) VALUES (?, ?, ?, 'customer')",
        [customer_name, customer_phone, dummyPassword],
      );
      customer_id = newUser.insertId;
    }

    // Generate unique ticket code (e.g. RES-XXXXXX)
    const ticket_code =
      "RES-" + crypto.randomBytes(3).toString("hex").toUpperCase();

    // Prevent double booking
    const [existingBookings] = await db.query(
      "SELECT id FROM reservations WHERE kapster_id = ? AND booking_date = ? AND booking_time = ? AND status != 'cancelled'",
      [kapster_id, booking_date, booking_time],
    );

    if (existingBookings.length > 0) {
      return res
        .status(400)
        .json({
          message:
            "Jadwal ini sudah dibooking oleh pelanggan lain. Silakan pilih waktu atau kapster lain.",
        });
    }

    const [result] = await db.query(
      "INSERT INTO reservations (ticket_code, customer_id, kapster_id, service_id, booking_date, booking_time, status) VALUES (?, ?, ?, ?, ?, ?, 'pending')",
      [
        ticket_code,
        customer_id,
        kapster_id,
        service_id,
        booking_date,
        booking_time,
      ],
    );

    res.status(201).json({
      message: "Reservation created successfully",
      reservation_id: result.insertId,
      ticket_code: ticket_code,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getReservationByTicket = async (req, res) => {
  try {
    const { ticket_code } = req.params;
    const [rows] = await db.query(
      `
      SELECT r.*, 
        COALESCE(u.name, 'Walk-in Customer') as customer_name, 
        u.phone as customer_phone,
        COALESCE(k.name, '-') as kapster_name, 
        s.name as service_name, 
        s.price 
      FROM reservations r
      LEFT JOIN users u ON r.customer_id = u.id
      LEFT JOIN kapsters k ON r.kapster_id = k.id
      LEFT JOIN services s ON r.service_id = s.id
      WHERE r.ticket_code = ?
    `,
      [ticket_code],
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Reservation not found" });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.updateReservationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await db.query("UPDATE reservations SET status = ? WHERE id = ?", [
      status,
      id,
    ]);
    res.json({ message: "Status updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getReservationsByPhone = async (req, res) => {
  try {
    const { phone } = req.params;
    const [rows] = await db.query(
      `
      SELECT r.*, 
        COALESCE(u.name, 'Walk-in Customer') as customer_name, 
        COALESCE(k.name, '-') as kapster_name, 
        s.name as service_name, 
        s.price,
        t.created_at as transaction_date
      FROM reservations r
      LEFT JOIN users u ON r.customer_id = u.id
      LEFT JOIN kapsters k ON r.kapster_id = k.id
      LEFT JOIN services s ON r.service_id = s.id
      LEFT JOIN transactions t ON t.id = r.transaction_id OR t.reservation_id = r.id
      WHERE u.phone = ?
      ORDER BY r.created_at DESC
    `,
      [phone],
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getBookedTimes = async (req, res) => {
  try {
    const { kapster_id, date } = req.query;
    if (!kapster_id || !date) {
      return res
        .status(400)
        .json({ message: "kapster_id and date are required" });
    }
    const [rows] = await db.query(
      `SELECT r.booking_time, s.name as service_name 
       FROM reservations r
       LEFT JOIN services s ON r.service_id = s.id
       WHERE r.kapster_id = ? AND r.booking_date = ? AND r.status != 'cancelled'`,
      [kapster_id, date],
    );

    const bookedTimes = [];
    rows.forEach((r) => {
      let timeStr = r.booking_time;
      if (typeof timeStr === "string" && timeStr.length >= 5) {
        timeStr = timeStr.substring(0, 5);
      }
      bookedTimes.push(timeStr);

      if (r.service_name && r.service_name.toLowerCase().includes("coloring")) {
        let [hour, min] = timeStr.split(":").map(Number);
        for (let i = 0; i < 3; i++) {
          min += 30;
          if (min >= 60) {
            hour += 1;
            min -= 60;
          }
          const nextTime = `${hour.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}`;
          bookedTimes.push(nextTime);
        }
      }
    });

    // Remove duplicates just in case
    res.json([...new Set(bookedTimes)]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.cancelReservationByTicket = async (req, res) => {
  try {
    const { ticket_code } = req.params;

    // Pastikan reservasi dengan tiket ini ada dan masih pending
    const [rows] = await db.query(
      "SELECT id, status FROM reservations WHERE ticket_code = ?",
      [ticket_code],
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Tiket tidak ditemukan" });
    }

    if (rows[0].status !== "pending") {
      return res
        .status(400)
        .json({
          message:
            "Hanya reservasi dengan status pending yang dapat dibatalkan oleh pelanggan",
        });
    }

    await db.query(
      "UPDATE reservations SET status = 'cancelled' WHERE id = ?",
      [rows[0].id],
    );
    res.json({ message: "Reservasi berhasil dibatalkan" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.deleteReservation = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Pastikan reservasi ada dan statusnya cancelled
    const [rows] = await db.query("SELECT id, status FROM reservations WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Reservasi tidak ditemukan" });
    }
    
    if (rows[0].status !== "cancelled") {
      return res.status(400).json({ message: "Hanya reservasi yang dibatalkan yang dapat dihapus" });
    }
    
    await db.query("DELETE FROM reservations WHERE id = ?", [id]);
    res.json({ message: "Laporan transaksi/reservasi berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting reservation:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
