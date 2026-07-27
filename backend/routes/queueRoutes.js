const express = require("express");
const router = express.Router();
const queueController = require("../controllers/queueController");
const { verifyToken, requireRole } = require("../middlewares/authMiddleware");

// Route untuk Kasir membuat antrian dan mengambil daftar
router.post(
  "/",
  verifyToken,
  requireRole(["cashier", "admin"]),
  queueController.createQueue,
);
router.get(
  "/",
  verifyToken,
  requireRole(["cashier", "admin"]),
  queueController.getActiveQueues,
);
router.patch(
  "/:id/complete",
  verifyToken,
  requireRole(["cashier", "admin"]),
  queueController.completeQueue,
);

module.exports = router;
