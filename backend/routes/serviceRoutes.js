const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/serviceController");
const { verifyToken, requireRole } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

router.get("/", serviceController.getAllServices);
router.get("/:id", serviceController.getServiceById);

// Protected routes (Admin only)
router.post(
  "/",
  verifyToken,
  requireRole(["admin"]),
  upload.single("photo"),
  serviceController.createService,
);
router.put(
  "/:id",
  verifyToken,
  requireRole(["admin"]),
  upload.single("photo"),
  serviceController.updateService,
);
router.delete(
  "/:id",
  verifyToken,
  requireRole(["admin"]),
  serviceController.deleteService,
);

module.exports = router;
