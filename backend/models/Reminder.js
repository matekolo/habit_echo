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
            type: Date, // Mo¿liwoœæ ustawienia przypomnienia na konkretny dzieñ
            required: false,
        },
        repeat: {
            type: String, // Mo¿liwoœci: "daily", "weekly", "once"
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
