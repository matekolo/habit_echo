const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// 🔹 Generowanie tokena JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// 🔹 Rejestracja użytkownika
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Wszystkie pola są wymagane");
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error("Użytkownik już istnieje");
    }

    const user = await User.create({ name, email, password });
    if (user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error("Nie udało się zarejestrować");
    }
});

// 🔹 Logowanie użytkownika
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error("Wszystkie pola są wymagane");
    }

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error("Nieprawidłowe dane logowania");
    }
});

// 🔹 Pobieranie profilu użytkownika
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);

    if (user) {
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
        });
    } else {
        res.status(404);
        throw new Error("Użytkownik nie znaleziony");
    }
});

// 🔹 Wylogowanie użytkownika
const logoutUser = (req, res) => {
    res.clearCookie("token"); // Usunięcie tokena z ciasteczka
    res.status(200).json({ message: "Wylogowano pomyślnie" });
};

// ✅ Eksportowanie wszystkich funkcji
module.exports = { registerUser, loginUser, getUserProfile, logoutUser };
