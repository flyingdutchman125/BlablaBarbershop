const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { verifyToken, requireRole } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

// Products can be fetched by Cashier and Admin
router.get("/", productController.getAllProducts);

// Only Admin can manage products
router.post(
  "/",
  verifyToken,
  requireRole(["admin"]),
  upload.single("photo"),
  productController.createProduct,
);
router.put(
  "/:id",
  verifyToken,
  requireRole(["admin"]),
  upload.single("photo"),
  productController.updateProduct,
);
router.delete(
  "/:id",
  verifyToken,
  requireRole(["admin"]),
  productController.deleteProduct,
);

module.exports = router;
