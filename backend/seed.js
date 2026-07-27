const db = require("./config/db");
const bcrypt = require("bcrypt");

async function seedUsers() {
  try {
    // Karena saat ini authController mockup kita belum ngecek bcrypt, kita masukkan
    // langsung saja untuk mockup. Tapi jika Anda sudah memakai bcrypt, pastikan di-hash.
    // Di sini saya hash passwordnya agar standar dan aman jika Anda aktifkan bcrypt.compare nanti.
    const salt = await bcrypt.genSalt(10);
    const hashedAdminPassword = await bcrypt.hash("admin123", salt);
    const hashedKasirPassword = await bcrypt.hash("kasir123", salt);

    console.log("Menghapus data user lama (jika ada)...");
    // Hapus dulu jika sudah ada agar tidak duplikat
    await db.query(
      'DELETE FROM users WHERE phone IN ("08111111111", "08222222222")',
    );

    console.log("Memasukkan akun dummy Kasir & Admin...");
    await db.query(
      `INSERT INTO users (name, phone, password, role) VALUES 
      ('Super Admin', '08111111111', ?, 'admin'),
      ('Front Desk Kasir', '08222222222', ?, 'cashier')`,
      [hashedAdminPassword, hashedKasirPassword],
    );

    console.log("✅ Akun dummy berhasil dibuat!");
    console.log("==================================");
    console.log("ADMIN -> Nomor: 08111111111 | Password: admin123");
    console.log("KASIR -> Nomor: 08222222222 | Password: kasir123");
    console.log("==================================");
    process.exit(0);
  } catch (err) {
    console.error("Gagal memasukkan data:", err);
    process.exit(1);
  }
}

seedUsers();
