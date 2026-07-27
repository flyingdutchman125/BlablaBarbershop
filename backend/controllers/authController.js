const db = require("../config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt"); // Jika Anda ingin menggunakan bcrypt nanti, pastikan `npm install bcrypt`
require("dotenv").config();

exports.login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    // Cari user berdasarkan nomor telepon
    const [rows] = await db.query("SELECT * FROM users WHERE phone = ?", [
      phone,
    ]);

    if (rows.length === 0) {
      return res
        .status(401)
        .json({ message: "Nomor telepon atau password salah" });
    }

    const user = rows[0];

    // Bandingkan password yang diinput dengan hash di database
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res
        .status(401)
        .json({ message: "Nomor telepon atau password salah" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: user.id, name: user.name, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );

    res.json({
      message: "Login berhasil",
      token: token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
