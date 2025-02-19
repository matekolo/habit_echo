const express = require("express");
const { getUserStats, getWeeklyStats } = require("../controllers/statsController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getUserStats);
router.get("/weekly", protect, getWeeklyStats);

module.exports = router;
