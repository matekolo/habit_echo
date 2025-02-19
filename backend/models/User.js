const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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

// ✅ Haszowanie hasła przed zapisaniem do bazy danych
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// ✅ Metoda do sprawdzania poprawności hasła
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
