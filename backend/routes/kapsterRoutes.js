const express = require("express");
const router = express.Router();
const kapsterController = require("../controllers/kapsterController");
const { verifyToken, requireRole } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

router.get("/", kapsterController.getAllKapsters);
router.get("/:id", kapsterController.getKapsterById);

// Protected routes (Admin only)
router.post(
  "/",
  verifyToken,
  requireRole(["admin"]),
  upload.single("photo"),
  kapsterController.createKapster,
);
router.put(
  "/:id",
  verifyToken,
  requireRole(["admin"]),
  upload.single("photo"),
  kapsterController.updateKapster,
);
router.delete(
  "/:id",
  verifyToken,
  requireRole(["admin"]),
  kapsterController.deleteKapster,
);

module.exports = router;
