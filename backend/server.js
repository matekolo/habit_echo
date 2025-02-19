const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const habitRoutes = require("./routes/habitRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");
const reminderRoutes = require("./routes/reminderRoutes");
require("./utils/cronJobs");
const rewardRoutes = require("./routes/rewardRoutes");

// Konfiguracja zmiennych œrodowiskowych
dotenv.config();

// Inicjalizacja aplikacji
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use("/api/users", userRoutes);
app.use("/api/habits", habitRoutes);
app.use("/api/schedule", scheduleRoutes);
app.use("/api/reminders", reminderRoutes);
app.use("/api/rewards", rewardRoutes);

// Po³¹cz z baz¹ danych
connectDB();

// Podstawowy endpoint testowy
app.get("/", (req, res) => {
    res.send("Habit Echo API is running...");
});

// Nas³uchiwanie serwera
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serwer dzia³a na porcie ${PORT}`));
