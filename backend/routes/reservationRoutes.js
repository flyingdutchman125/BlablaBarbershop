const express = require("express");
const router = express.Router();
const reservationController = require("../controllers/reservationController");
const { verifyToken, requireRole } = require("../middlewares/authMiddleware");

router.get(
  "/",
  verifyToken,
  requireRole(["admin"]),
  reservationController.getAllReservations,
);
router.post("/", reservationController.createReservation);
router.get("/booked-times", reservationController.getBookedTimes);
router.get(
  "/ticket/:ticket_code",
  reservationController.getReservationByTicket,
);
router.patch(
  "/ticket/:ticket_code/cancel",
  reservationController.cancelReservationByTicket,
);
router.get("/phone/:phone", reservationController.getReservationsByPhone);

// Contoh proteksi: Hanya cashier atau admin yang bisa update status reservasi
router.patch(
  "/:id/status",
  verifyToken,
  requireRole(["cashier", "admin"]),
  reservationController.updateReservationStatus,
);

module.exports = router;
