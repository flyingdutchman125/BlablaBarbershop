const express = require("express");
const router = express.Router();
const expenseController = require("../controllers/expenseController");
const { verifyToken, requireRole } = require("../middlewares/authMiddleware");

router.get(
  "/",
  verifyToken,
  requireRole(["admin"]),
  expenseController.getAllExpenses,
);
router.post(
  "/",
  verifyToken,
  requireRole(["admin"]),
  expenseController.createExpense,
);
router.delete(
  "/:id",
  verifyToken,
  requireRole(["admin"]),
  expenseController.deleteExpense,
);

module.exports = router;
