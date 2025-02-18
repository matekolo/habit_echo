const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");

// Konfiguracja zmiennych �rodowiskowych
dotenv.config();

// Inicjalizacja aplikacji
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use("/api/users", userRoutes);

// Po��cz z baz� danych
connectDB();

// Podstawowy endpoint testowy
app.get("/", (req, res) => {
    res.send("Habit Echo API is running...");
});

// Nas�uchiwanie serwera
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serwer dzia�a na porcie ${PORT}`));
