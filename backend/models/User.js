const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        points: { type: Number, default: 0 },
        rewards: [
            {
                title: String,
                description: String,
                date: { type: Date, default: Date.now },
            },
        ],
        completedHabits: { type: Number, default: 0 },
        completedTasks: { type: Number, default: 0 },
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
