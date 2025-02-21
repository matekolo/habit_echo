const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const { protect } = require("./middleware/authMiddleware");
const userRoutes = require("./routes/userRoutes");
const habitRoutes = require("./routes/habitRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");
const reminderRoutes = require("./routes/reminderRoutes");
require("./utils/cronJobs");
const rewardRoutes = require("./routes/rewardRoutes");
const statsRoutes = require("./routes/statsRoutes");
const exportRoutes = require("./routes/exportRoutes");

dotenv.config();
const app = express();

// 🔹 Obsługa JSON w Express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔹 Obsługa CORS
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
        methods: "GET,POST,PUT,DELETE,OPTIONS",
        allowedHeaders: "Content-Type, Authorization",
    })
);

// 🔹 Obsługa ciasteczek
app.use(cookieParser());

// 🔹 API ROUTES
app.use("/api/users", userRoutes);
app.use("/api/habits", habitRoutes);
app.use("/api/schedule", protect, scheduleRoutes);
app.use("/api/reminders", reminderRoutes);
app.use("/api/rewards", rewardRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/export", exportRoutes);

// Połącz z bazą danych
connectDB();

// Podstawowy endpoint testowy
app.get("/", (req, res) => {
    res.send("Habit Echo API is running...");
});

// Uruchomienie serwera
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serwer działa na porcie ${PORT}`));
