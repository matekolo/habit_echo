const express = require("express");
const { exportPDF, exportCSV } = require("../controllers/exportController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/pdf", protect, exportPDF);
router.get("/csv", protect, exportCSV);

module.exports = router;
