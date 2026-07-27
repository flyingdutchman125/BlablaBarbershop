const express = require("express");
const router = express.Router();
const memberController = require("../controllers/memberController");
const { verifyToken } = require("../middlewares/authMiddleware");

router.post("/", verifyToken, memberController.registerMember);
router.get("/", verifyToken, memberController.getAllMembers);
router.get("/:phone", verifyToken, memberController.getMemberByPhone);
router.delete("/:id", verifyToken, memberController.deleteMember);

module.exports = router;
