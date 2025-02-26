const express = require("express");
const router = express.Router();
const { getSchedule, addScheduleItem, deleteScheduleItem } = require("../controllers/scheduleController");

router.get("/", getSchedule);
router.post("/", addScheduleItem);
router.delete("/:id", deleteScheduleItem);

module.exports = router;
