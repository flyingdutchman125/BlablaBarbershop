const jwt = require("jsonwebtoken");
require("dotenv").config();

// Verify JWT Token Middleware
exports.verifyToken = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res
      .status(403)
      .json({ message: "Akses ditolak, token tidak tersedia" });
  }

  try {
    // Expecting format: "Bearer <token>"
    const bearerToken = token.split(" ")[1];
    const decoded = jwt.verify(bearerToken, process.env.JWT_SECRET);
    req.user = decoded; // { id, name, role }
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Token tidak valid atau sudah kadaluarsa" });
  }
};

// Role-based Access Middleware
exports.requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({
          message: "Akses ditolak, Anda tidak memiliki izin (Role mismatch)",
        });
    }
    next();
  };
};
