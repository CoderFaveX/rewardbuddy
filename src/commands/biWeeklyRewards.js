const User = require("../models/user");
const { sendMessage } = require("./base_commands");

async function generateMessage(chatId) {
  const url = `${TELEGRAM_API}/sendMessage`;
  const message = {
    chat_id: chatId,
    text: `🎉 <b>Congratulations!</b> 🎉
  
  You're one of our top active users and have earned #500 airtime! 🎁
  
  Please choose the network of your choice to claim your reward.
  
  Keep up the amazing work and stay active to earn even more rewards! 💪
  
  Thank you for being a valuable member of our community! 😊`,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Claim Airtime!!",
            url: `https://rewardbuddy.vercel.app/claimairtime?chatId=${chatId}`,
          },
        ], // should open a pop up inside telegram
      ],
    },
  };
  await axios.post(url, message, {
    headers: { "Content-Type": "application/json" },
  });
}

async function distributeBiWeeklyRewards() {
  try {
    // Fetch, sort, and select top users based on biWeeklyActivity
    const topUsers = await User.aggregate([
      { $sort: { biWeeklyActivity: -1 } },
      { $limit: 2 }, // adjust limit bruh
    ]);

    // Reward top users
    for (const user of topUsers) {
      user.validToken = true;
      await generateMessage(user.chatId);
      console.log(`Rewarding user: ${user.chatId}`);
      await user.save();
    }

    await User.updateMany({}, { $set: { biWeeklyActivity: 0 } });

    console.log("Bi-weekly rewards distributed and counters reset");
  } catch (error) {
    console.error("Error during bi-weekly rewards process:", error);
  }
}

module.exports = distributeBiWeeklyRewards;
