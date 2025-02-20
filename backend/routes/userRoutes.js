const express = require("express");
const { registerUser, loginUser, getUserProfile, logoutUser } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);
router.post("/logout", logoutUser); // 🔹 Nowa trasa do wylogowywania

module.exports = router;
