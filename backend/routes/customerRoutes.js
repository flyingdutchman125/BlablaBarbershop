const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");
const { verifyToken, requireRole } = require("../middlewares/authMiddleware");

// Protected route (Admin only)
router.get(
  "/",
  verifyToken,
  requireRole(["admin"]),
  customerController.getAllCustomers,
);

module.exports = router;
