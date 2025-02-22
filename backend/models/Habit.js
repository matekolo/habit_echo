﻿const mongoose = require("mongoose");

const habitSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        startDate: {
            type: Date,
            default: Date.now, // 📌 Moment rozpoczęcia liczenia
        }
    },
    { timestamps: true }
);

const Habit = mongoose.model("Habit", habitSchema);
module.exports = Habit;
