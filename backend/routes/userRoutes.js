const express = require("express");
const { registerUser, loginUser } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");


const router = express.Router();
router.get("/profile", protect, (req, res) => {
    res.json(req.user);
});
router.post("/register", registerUser);
router.post("/login", loginUser);


module.exports = router;
