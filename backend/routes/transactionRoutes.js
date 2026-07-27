const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");
const { verifyToken, requireRole } = require("../middlewares/authMiddleware");

// Protected route (Cashier and Admin only)
router.post(
  "/",
  verifyToken,
  requireRole(["cashier", "admin"]),
  transactionController.createTransaction,
);

module.exports = router;
