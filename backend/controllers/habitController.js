const Habit = require("../models/Habit");
const User = require("../models/User");

// Pobranie wszystkich nawyków u¿ytkownika
const getHabits = async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user.id });
    res.json(habits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Tworzenie nowego nawyku
const createHabit = async (req, res) => {
  const { title, description, frequency } = req.body;

  if (!title || !frequency) {
    return res.status(400).json({ message: "Tytu³ i czêstotliwoœæ s¹ wymagane" });
  }

  try {
    const habit = await Habit.create({
      user: req.user.id,
      title,
      description,
      frequency,
    });

    res.status(201).json(habit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Aktualizacja nawyku
const updateHabit = async (req, res) => {
    try {
        const habit = await Habit.findById(req.params.id);
        if (!habit) {
            return res.status(404).json({ message: "Nawyk nie znaleziony" });
        }

        if (habit.user.toString() !== req.user.id) {
            return res.status(401).json({ message: "Brak autoryzacji" });
        }

        // Sprawdzenie, czy nawyk nie by³ wczeœniej wykonany
        if (!habit.completed) {
            // Dodanie punktów u¿ytkownikowi
            const user = await User.findById(req.user.id);
            user.points += habit.points;
            await user.save();
        }

        // Aktualizacja nawyku (oznaczenie jako wykonany)
        habit.completed = req.body.completed;
        const updatedHabit = await habit.save();

        res.json(updatedHabit);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Usuwanie nawyku
const deleteHabit = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    if (!habit) {
      return res.status(404).json({ message: "Nawyk nie znaleziony" });
    }

    if (habit.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Brak autoryzacji" });
    }

    await Habit.findByIdAndDelete(req.params.id);
    res.json({ message: "Nawyk usuniêty" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getHabits, createHabit, updateHabit, deleteHabit };
