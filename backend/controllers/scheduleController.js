const Schedule = require("../models/Schedule");

// Pobranie harmonogramu u¿ytkownika
const getSchedule = async (req, res) => {
    try {
        const schedule = await Schedule.find({ user: req.user.id });
        res.json(schedule);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Tworzenie nowego wpisu w harmonogramie
const createSchedule = async (req, res) => {
    const { title, description, startTime, endTime, days } = req.body;

    if (!title || !startTime || !endTime || !days || days.length === 0) {
        return res.status(400).json({ message: "Wszystkie pola s¹ wymagane" });
    }

    try {
        const schedule = await Schedule.create({
            user: req.user.id,
            title,
            description,
            startTime,
            endTime,
            days,
        });

        res.status(201).json(schedule);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Aktualizacja wpisu w harmonogramie
const updateSchedule = async (req, res) => {
    try {
        const schedule = await Schedule.findById(req.params.id);
        if (!schedule) {
            return res.status(404).json({ message: "Harmonogram nie znaleziony" });
        }

        if (schedule.user.toString() !== req.user.id) {
            return res.status(401).json({ message: "Brak autoryzacji" });
        }

        const updatedSchedule = await Schedule.findByIdAndUpdate(req.params.id, req.body, { new: true });

        res.json(updatedSchedule);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Usuwanie wpisu w harmonogramie
const deleteSchedule = async (req, res) => {
    try {
        const schedule = await Schedule.findById(req.params.id);
        if (!schedule) {
            return res.status(404).json({ message: "Harmonogram nie znaleziony" });
        }

        if (schedule.user.toString() !== req.user.id) {
            return res.status(401).json({ message: "Brak autoryzacji" });
        }

        await Schedule.findByIdAndDelete(req.params.id);
        res.json({ message: "Harmonogram usuniêty" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getSchedule, createSchedule, updateSchedule, deleteSchedule };
