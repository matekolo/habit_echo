const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");

const protect = asyncHandler(async (req, res, next) => {
    let token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    if (!token) {
        res.status(401);
        throw new Error("Brak tokena, nieautoryzowany");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");

        if (!req.user) {
            res.status(401);
            throw new Error("Nie znaleziono użytkownika");
        }

        next();
    } catch (error) {
        res.status(401);
        throw new Error("Nieautoryzowany, błędny token");
    }
});

module.exports = { protect };
