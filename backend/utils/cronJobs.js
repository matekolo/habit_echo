const cron = require("node-cron");
const Reminder = require("../models/Reminder");

// Sprawdzanie przypomnień co minutę
cron.schedule("* * * * *", async () => {
  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5);

  const reminders = await Reminder.find({ time: currentTime, sent: false });

  reminders.forEach(async (reminder) => {
    console.log(`🔔 Przypomnienie: ${reminder.message}`);
    reminder.sent = true;
    await reminder.save();
  });
});

console.log("CRON job uruchomiony!");
