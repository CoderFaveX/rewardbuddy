const User = require("../models/user");
const { sendMessage } = require("./base_commands");

async function distributeBiWeeklyRewards() {
    try {
        // Fetch, sort, and select top users based on biWeeklyActivity
        const topUsers = await User.aggregate([
            { $sort: { biWeeklyActivity: -1 } },
            { $limit: 2 }, // Adjust limit as per your requirement
        ]);

        // Reward top users
        for (const user of topUsers) {
            await sendMessage(user.chatId, "Congratulations! You've earned a reward.");
            console.log(`Rewarding user: ${user.chatId}`);
            // Implement actual reward logic here
        }

        // Reset biWeeklyActivity counter for all users
        // Uncomment the line below when ready to reset counters
        // await User.updateMany({}, { $set: { biWeeklyActivity: 0 } });

        console.log("Bi-weekly rewards distributed and counters reset");
    } catch (error) {
        console.error("Error during bi-weekly rewards process:", error);
    }
}

module.exports = distributeBiWeeklyRewards;
