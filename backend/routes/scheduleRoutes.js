const express = require("express");
const { getSchedule, createSchedule, updateSchedule, deleteSchedule } = require("../controllers/scheduleController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getSchedule);
router.post("/", protect, createSchedule);
router.put("/:id", protect, updateSchedule);
router.delete("/:id", protect, deleteSchedule);

module.exports = router;
