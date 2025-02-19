﻿const express = require("express");
const { registerUser, loginUser } = require("../controllers/userController"); // <-- ✅ Upewnij się, że obie funkcje są importowane
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, (req, res) => {
    res.json(req.user);
});

module.exports = router;
