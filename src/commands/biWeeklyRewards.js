const User = require("../models/user");
const axios = require("axios");
const { sendMessage } = require("./base_commands");

const TOKEN = process.env.TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;

async function generateMessage(chatId) {
  const url = `${TELEGRAM_API}/sendMessage`;
  const message = {
    chat_id: chatId,
    text: "🎉 <b>Congratulations!</b> 🎉\n\nYou're one of our top active users and have earned #500 airtime! 🎁\nPlease choose the network of your choice to claim your reward.\nKeep up the amazing work and stay active to earn even more rewards! 💪\nThank you for being a valuable member of our community! 😊",
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
    console.log(JSON.stringify(topUsers))
    const users = await User.find({});

    // Reward top users
    if (topUsers) {
      for (const user of topUsers) {
        user.validToken = true;
        await generateMessage(user.chatId);
        console.log(`Rewarding user: ${user.chatId}`);
        await user.save();
      }
      await User.updateMany({}, { $set: { biWeeklyActivity: 0 } });
    } else {
      for (const user of users) {
        await sendMessage(
          user.chatId,
          `😅 Oops! It looks like there are no top users this time around. 😅\nBut don't worry, the game is still on! 💪 Keep participating, stay active, and you could be our next top user! 🌟\nRemember, every interaction counts, so keep engaging and let's see who makes it to the top next time! 🚀\nGood luck and have fun! 🎉`
        );
      }
    }

    console.log("Bi-weekly rewards distributed and counters reset");
  } catch (error) {
    console.error("Error during bi-weekly rewards process:", error);
  }
}

module.exports = distributeBiWeeklyRewards;
