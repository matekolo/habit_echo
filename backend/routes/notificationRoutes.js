const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const dummyNotifications = [
    { id: 1, message: "🔔 Przypomnienie: Trening o 18:00" },
    { id: 2, message: "📅 Jutro masz spotkanie o 9:00" },
];

router.get("/", protect, (req, res) => {
    res.json(dummyNotifications);
});

module.exports = router;
