const asyncHandler = require("express-async-handler");
const Schedule = require("../models/Schedule");

// 🔹 Pobieranie harmonogramu użytkownika
const getSchedule = asyncHandler(async (req, res) => {
    const schedule = await Schedule.find({ user: req.user.id });


    if (!schedule) {
        return res.status(404).json({ message: "Harmonogram nie znaleziony" });
    }

    // Konwersja wyników przed zwróceniem
    const formattedSchedule = schedule.map(item => ({
        _id: item._id,
        title: item.title,
        description: item.description || "Brak opisu",
        dayOfWeek: item.dayOfWeek || "Nieznany dzień",
        startTime: item.startTime,
        endTime: item.endTime,
    }));

    res.json(formattedSchedule);
});

// 🔹 Dodawanie nowego wydarzenia do harmonogramu
const addScheduleItem = asyncHandler(async (req, res) => {

    const { title, description, dayOfWeek, startTime, endTime } = req.body;

    if (!title || !dayOfWeek || !startTime || !endTime) {
        res.status(400);
        throw new Error("Wszystkie pola są wymagane");
    }

    if (!req.user) {
        res.status(401);
        throw new Error("Nieautoryzowany - brak użytkownika");
    }

    const scheduleItem = await Schedule.create({
        user: req.user.id,
        title,
        description,
        dayOfWeek,
        startTime,
        endTime,
    });

    res.status(201).json(scheduleItem);
});

module.exports = { getSchedule, addScheduleItem };
