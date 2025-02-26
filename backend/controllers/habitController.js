const Habit = require("../models/Habit");

// 📌 Pobranie listy nawyków użytkownika
const getHabits = async (req, res) => {
    try {
        const habits = await Habit.find({ user: req.user.id });
        res.json(habits);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 📌 Dodanie nowego nawyku
const addHabit = async (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ message: "Nazwa nawyku jest wymagana" });
    }

    try {
        const newHabit = await Habit.create({
            user: req.user.id,
            name,
        });

        res.status(201).json({ message: "Dodano nowy nawyk!", habit: newHabit });
    } catch (error) {
        res.status(500).json({ message: "Błąd podczas dodawania nawyku!" });
    }
};

// 📌 Resetowanie nawyku (ustawienie nowej daty startowej)
const resetHabit = async (req, res) => {
    try {
        const habit = await Habit.findById(req.params.id);
        if (!habit) {
            return res.status(404).json({ message: "Nawyk nie znaleziony" });
        }
        if (habit.user.toString() !== req.user.id) {
            return res.status(401).json({ message: "Brak autoryzacji" });
        }

        habit.startDate = new Date();
        await habit.save();

        res.json({ message: "Nawyk zresetowany!", habit });
    } catch (error) {
        res.status(500).json({ message: "Błąd podczas resetowania nawyku!" });
    }
};

// 📌 Usunięcie nawyku
const deleteHabit = async (req, res) => {
    try {
        const habit = await Habit.findById(req.params.id);
        if (!habit) {
            return res.status(404).json({ message: "Nawyk nie znaleziony" });
        }
        if (habit.user.toString() !== req.user.id) {
            return res.status(401).json({ message: "Brak autoryzacji" });
        }

        await habit.deleteOne();
        res.json({ message: "Nawyk usunięty!" });
    } catch (error) {
        res.status(500).json({ message: "Błąd podczas usuwania nawyku!" });
    }
};

// 📌 Eksportowanie funkcji
module.exports = { getHabits, addHabit, resetHabit, deleteHabit };
