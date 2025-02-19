const Reminder = require("../models/Reminder");

// Pobranie przypomnieñ u¿ytkownika
const getReminders = async (req, res) => {
    try {
        const reminders = await Reminder.find({ user: req.user.id });
        res.json(reminders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Tworzenie nowego przypomnienia
const createReminder = async (req, res) => {
    const { title, message, time, date, repeat } = req.body;

    if (!title || !message || !time) {
        return res.status(400).json({ message: "Tytu³, wiadomoœæ i godzina s¹ wymagane" });
    }

    try {
        const reminder = await Reminder.create({
            user: req.user.id,
            title,
            message,
            time,
            date,
            repeat,
        });

        res.status(201).json(reminder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Usuwanie przypomnienia
const deleteReminder = async (req, res) => {
    try {
        const reminder = await Reminder.findById(req.params.id);
        if (!reminder) {
            return res.status(404).json({ message: "Przypomnienie nie znalezione" });
        }

        if (reminder.user.toString() !== req.user.id) {
            return res.status(401).json({ message: "Brak autoryzacji" });
        }

        await Reminder.findByIdAndDelete(req.params.id);
        res.json({ message: "Przypomnienie usuniête" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getReminders, createReminder, deleteReminder };
