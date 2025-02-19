const User = require("../models/User");

// Pobranie dostêpnych nagród
const getAvailableRewards = async (req, res) => {
    const rewards = [
        { title: "Nowy motyw", description: "Odblokuj nowy kolor interfejsu", cost: 50 },
        { title: "Odznaka Mistrza", description: "Za zdobycie 500 punktów", cost: 500 },
    ];
    res.json(rewards);
};

// Odbieranie nagrody przez u¿ytkownika
const claimReward = async (req, res) => {
    const { title, description, cost } = req.body;

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "U¿ytkownik nie znaleziony" });
        }

        if (user.points < cost) {
            return res.status(400).json({ message: "Za ma³o punktów na nagrodê" });
        }

        // Odejmowanie punktów i zapis nagrody
        user.points -= cost;
        user.rewards.push({ title, description });
        await user.save();

        res.json({ message: "Nagroda odebrana", user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAvailableRewards, claimReward };
