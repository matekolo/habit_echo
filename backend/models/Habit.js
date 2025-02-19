const mongoose = require("mongoose");

const habitSchema = new mongoose.Schema(
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
        description: {
            type: String,
        },
        frequency: {
            type: String,
            enum: ["daily", "weekly", "monthly"],
            required: true,
        },
        completed: {
            type: Boolean,
            default: false,
        },
        points: {
            type: Number,
            default: 10,
        },
    },
    { timestamps: true }
);

const Habit = mongoose.model("Habit", habitSchema);
module.exports = Habit;
