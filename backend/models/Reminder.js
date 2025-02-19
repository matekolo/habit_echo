const mongoose = require("mongoose");

const reminderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        time: {
            type: String, // Format "HH:mm"
            required: true,
        },
        date: {
            type: Date, // Mo�liwo�� ustawienia przypomnienia na konkretny dzie�
            required: false,
        },
        repeat: {
            type: String, // Mo�liwo�ci: "daily", "weekly", "once"
            default: "once",
        },
        sent: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const Reminder = mongoose.model("Reminder", reminderSchema);
module.exports = Reminder;
