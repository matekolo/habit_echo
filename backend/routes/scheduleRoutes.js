const express = require("express");
const { getSchedule, addScheduleItem } = require("../controllers/scheduleController");

const router = express.Router();

router.get("/", getSchedule);
router.post("/", addScheduleItem);

module.exports = router;
