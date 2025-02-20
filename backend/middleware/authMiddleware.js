const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");

const protect = asyncHandler(async (req, res, next) => {
    let token;

    // Pobieramy token z ciasteczka (lub z nagłówka, jeśli tak zdecydujesz)
    if (req.cookies.token) {
        token = req.cookies.token;
    } else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    // Jeśli brak tokena → zwróć błąd 401
    if (!token) {
        res.status(401);
        throw new Error("Brak tokena, nieautoryzowany");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");
        next();
    } catch (error) {
        res.status(401);
        throw new Error("Nieautoryzowany, błędny token");
    }
});

module.exports = { protect };
