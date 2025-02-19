const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema(
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
        startTime: {
            type: String,
            required: true,
        },
        endTime: {
            type: String,
            required: true,
        },
        days: {
            type: [String], // np. ["Monday", "Wednesday", "Friday"]
            required: true,
        },
    },
    { timestamps: true }
);

const Schedule = mongoose.model("Schedule", scheduleSchema);
module.exports = Schedule;
