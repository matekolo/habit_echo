const PDFDocument = require("pdfkit");
const fs = require("fs");
const fastCsv = require("fast-csv");
const User = require("../models/User");
const Habit = require("../models/Habit");

// Generowanie raportu PDF
const exportPDF = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("name email points completedHabits completedTasks");
        if (!user) {
            return res.status(404).json({ message: "Użytkownik nie znaleziony" });
        }

        const doc = new PDFDocument();
        const filePath = `./exports/report_${user.id}.pdf`;

        doc.pipe(fs.createWriteStream(filePath));
        doc.pipe(res);

        doc.fontSize(20).text("Raport użytkownika", { align: "center" });
        doc.moveDown();
        doc.fontSize(14).text(`Imię: ${user.name}`);
        doc.text(`Email: ${user.email}`);
        doc.text(`Punkty: ${user.points}`);
        doc.text(`Wykonane nawyki: ${user.completedHabits}`);
        doc.text(`Wykonane zadania: ${user.completedTasks}`);

        doc.end();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Generowanie raportu CSV
const exportCSV = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("name email points completedHabits completedTasks");
        if (!user) {
            return res.status(404).json({ message: "Użytkownik nie znaleziony" });
        }

        const filePath = `./exports/report_${user.id}.csv`;
        const writeStream = fs.createWriteStream(filePath);
        const csvStream = fastCsv.format({ headers: true });

        csvStream.pipe(writeStream).on("finish", () => {
            res.download(filePath);
        });

        csvStream.write({
            Imię: user.name,
            Email: user.email,
            Punkty: user.points,
            "Wykonane nawyki": user.completedHabits,
            "Wykonane zadania": user.completedTasks,
        });

        csvStream.end();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { exportPDF, exportCSV };
