const Habit = require("../models/Habit");
const User = require("../models/User");

// Pobranie statystyk u¿ytkownika
const getUserStats = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("points completedHabits completedTasks");
        if (!user) {
            return res.status(404).json({ message: "U¿ytkownik nie znaleziony" });
        }

        const totalHabits = await Habit.countDocuments({ user: req.user.id });

        res.json({
            points: user.points,
            completedHabits: user.completedHabits,
            completedTasks: user.completedTasks,
            totalHabits,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Podsumowanie tygodniowe/miesiêczne
const getWeeklyStats = async (req, res) => {
    try {
        const now = new Date();
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);

        const completedHabits = await Habit.countDocuments({
            user: req.user.id,
            completed: true,
            updatedAt: { $gte: weekAgo },
        });

        res.json({ completedHabitsLastWeek: completedHabits });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getUserStats, getWeeklyStats };
