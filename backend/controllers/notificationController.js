const Notification = require("../models/Notification");

// Pobranie powiadomie� u�ytkownika
const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Tworzenie nowego powiadomienia
const createNotification = async (req, res) => {
    const { message, type } = req.body;

    if (!message || !type) {
        return res.status(400).json({ message: "Wszystkie pola s� wymagane" });
    }

    try {
        const notification = await Notification.create({
            user: req.user.id,
            message,
            type,
        });

        res.status(201).json(notification);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Usuwanie powiadomienia
const deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (!notification) {
            return res.status(404).json({ message: "Powiadomienie nie znalezione" });
        }

        if (notification.user.toString() !== req.user.id) {
            return res.status(401).json({ message: "Brak autoryzacji" });
        }

        await Notification.findByIdAndDelete(req.params.id);
        res.json({ message: "Powiadomienie usuni�te" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getNotifications, createNotification, deleteNotification };
