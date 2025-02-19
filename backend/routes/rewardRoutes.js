const express = require("express");
const { getAvailableRewards, claimReward } = require("../controllers/rewardController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getAvailableRewards);
router.post("/claim", protect, claimReward);

module.exports = router;
