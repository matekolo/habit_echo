const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");

// Konfiguracja zmiennych œrodowiskowych
dotenv.config();

// Inicjalizacja aplikacji
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use("/api/users", userRoutes);

// Po³¹cz z baz¹ danych
connectDB();

// Podstawowy endpoint testowy
app.get("/", (req, res) => {
    res.send("Habit Echo API is running...");
});

// Nas³uchiwanie serwera
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serwer dzia³a na porcie ${PORT}`));
