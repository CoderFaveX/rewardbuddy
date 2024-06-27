const axios = require("axios");
const User = require("../models/user");
require("dotenv").config();

const TOKEN = process.env.TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;

let editing = false;

const commandList = {
  "/start": "Start using the bot and optionally provide a referrer ID.",
  "/setprofile": "Set your profile by entering your name and email.",
  "/profile": "View your profile information.",
  "/dashboard": "View your dashboard and available options.",
  "/refer": "Request for referral link",
  "/tasks": "View available tasks",
  "/contact_board": "View Contact Options",
  // Add more commands as needed
};

async function sendWelcomeMessage(chatId) {
  const url = `${TELEGRAM_API}/sendMessage`;
  const message = {
    chat_id: chatId,
    text: "<b>Hey!, Welcome to Reward Buddy</b>\n<i>Get paid for doing what you love.</i>\n\nRewardBuddy is a user-friendly rewards platform that motivates users to complete tasks, achieve milestones, and exhibit positive behavior. It's free to use, with no premium features or subscriptions. The platform is intuitive and rewarding, providing valuable insights and data. Support includes AI-powered assistance for instant solutions and human representatives available via chat for personalized support. Ideal for anyone seeking passive income opportunities with bi-weekly payouts.\n\nDo you have friends, relatives, or co-workers\nShare the opportunity right now!\nMore buddies, More Earnings.",
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [{ text: "View Dashboard 📊", callback_data: "dashboard" }],
        [{ text: "Privacy Policy 🔒", callback_data: "privacy_policy" }],
        [
          {
            text: "Terms and Conditions 📜",
            callback_data: "terms_conditions",
          },
        ],
        [{ text: "Disclaimer ℹ️", callback_data: "disclaimer" }],
        [{ text: "Contact Us 📞", callback_data: "contact_board" }],
      ],
    },
  };
  await axios.post(url, message, {
    headers: { "Content-Type": "application/json" },
  });
}
async function sendDashboardWelcome(chatId) {
  const url = `${TELEGRAM_API}/sendMessage`;
  const message = {
    chat_id: chatId,
    text: "<b>Welcome to your Dashboard 📊!</b>\nExplore various tools and features to maximize your earnings and experience.",
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [{ text: "View Profile 👤", callback_data: "profile" }],
        [{ text: "Complete Tasks 🛠️", callback_data: "complete_tasks" }], // Updated button text and emoji
        [{ text: "Check Earnings 💰", callback_data: "check_earnings" }],
        [{ text: "Withdraw 💸", callback_data: "withdraw" }],
        [{ text: "Edit Profile ✏️", callback_data: "edit_profile" }],
      ],
    },
  };
  await axios.post(url, message, {
    headers: { "Content-Type": "application/json" },
  });
}
async function sendContactBoard(chatId) {
  const url = `${TELEGRAM_API}/sendMessage`;
  const message = {
    chat_id: chatId,
    text: "<b>You can reach out to us through any of the following methods:</b>",
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [{ text: "Phone the team 📞", callback_data: "phone_us" }],
        [{ text: "Email Us 📧", callback_data: "email_us" }], // Updated button text and emoji
        [{ text: "Contact AI 🤖", callback_data: "contact_ai" }],
      ],
    },
  };
  await axios.post(url, message, {
    headers: { "Content-Type": "application/json" },
  });
}
async function sendPrivacyPolicy(chatId) {
  const url = `${TELEGRAM_API}/sendMessage`;
  const message = {
    chat_id: chatId,
    text: "Our Privacy Policy:\n\nThis is a placeholder message for the Privacy Policy. Please update it as per your organization's Privacy Policy.",
  };
  await axios.post(url, message, {
    headers: { "Content-Type": "application/json" },
  });
}
async function sendTermsConditions(chatId) {
  const url = `${TELEGRAM_API}/sendMessage`;
  const message = {
    chat_id: chatId,
    text: "Our Terms and Conditions:\n\nThis is a placeholder message for the Terms and Conditions. Please update it as per your organization's Terms and Conditions.",
  };
  await axios.post(url, message, {
    headers: { "Content-Type": "application/json" },
  });
}
async function sendDisclaimer(chatId) {
  const url = `${TELEGRAM_API}/sendMessage`;
  const message = {
    chat_id: chatId,
    text: "Our Disclaimer:\n\nThis is a placeholder message for the Disclaimer. Please update it as per your organization's Disclaimer.",
  };
  await axios.post(url, message, {
    headers: { "Content-Type": "application/json" },
  });
}
async function sendMessage(chatId, text) {
  const url = `${TELEGRAM_API}/sendMessage`;
  const message = {
    chat_id: chatId,
    text: text,
    parse_mode: "HTML",
  };
  await axios.post(url, message, {
    headers: { "Content-Type": "application/json" },
  });
}
async function sendProfile(chatId) {
  try {
    let user = await User.findOne({ chatId });
    if (user) {
      const url = `${TELEGRAM_API}/sendMessage`;
      const profileText = `<b>${
        user.profile.name || "N/A"
      }'s profile</b>\n\nEmail: ${user.profile.email || "N/A"}\nReferrals: ${
        user.referrals
      }\nEarnings: ₦${Number(user.earnings + user.refEarnings).toFixed(
        2
      )}\nReferral Earnings: ₦${Number(user.refEarnings).toFixed(2)}`;
      const message = {
        chat_id: chatId,
        text: profileText,
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [{ text: "Refer and Earn 🥇", callback_data: "refer" }],
          ],
        },
      };
      await axios.post(url, message, {
        headers: { "Content-Type": "application/json" },
      });
    } else {
      await sendMessage(chatId, "Register with /start to see your profile 🔒.");
    }
  } catch (error) {
    await sendMessage(
      chatId,
      `Error[${error.code}]: A error occured while fetching your profile`
    );
  }
}
async function sendReferLink(chatId) {
  const user = await User.findOne({ chatId });

  if (user) {
    const referrerLink = `${process.env.BASE_URL}?start=${chatId}`;
    await sendMessage(chatId, `Your referral link is: ${referrerLink}`);
  } else {
    await sendMessage(chatId, "Please register first with the /start command");
  }
}
const sendSelfReferWarning = async (chatId, warningtype) => {
  const url = `${TELEGRAM_API}/sendMessage`;
  let txt;
  switch (warningtype) {
    case "link_refer":
      txt =
        "⚠️ <b>Warning: Be cautious when clicking referral links!</b>\n\nHey there! It seems like you've already registered on RewardBuddy. Clicking on referral links again may lead to unintended actions.\n\nIf you have concerns or wish to report something, please reach out to our support team for assistance. We're here to help!\n\n📞 Contact support: /contact_board";
      break;
    case "self_refer":
      txt =
        "🚫 <b>Warning: Avoid Self-Referring</b>\n\nHey there! It looks like you're trying to use your own referral link. Self-referring isn't allowed on our platform as it violates our community guidelines. Continued attempts may result in the suspension of your account.\n\nPlease refrain from using this link for your own referrals. If you have any questions or need assistance, feel free to reach out to our support team. Thank you for understanding!\n\n📞 Contact support: /contact_board";
      break;
    default:
      txt =
        "⚠️ <b>Suspicious Activity Detected</b>\n\nHello, we've noticed some suspicious activity on your account. Please ensure your account security and avoid unusual actions.\n\nIf you believe this is an error or need assistance, please contact our support team immediately for further assistance.\n\n📞 Contact support: /contact_board";
  }
  const message = {
    chat_id: chatId,
    text: txt,
    parse_mode: "HTML",
  };
  await axios.post(url, message, {
    headers: { "Content-Type": "application/json" },
  });
};
async function sendTaskOptions(chatId) {
  const url = `${TELEGRAM_API}/sendMessage`;
  const message = {
    chat_id: chatId,
    text: "<b>Tasks you can complete:</b>\n\nChoose from the options below:", // Placeholder text for tasks
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [{ text: "Paid Ads 📺", callback_data: "task_paid_ads" }],
        [{ text: "Sponsored Posts 📝", callback_data: "task_sponsored_posts" }],
        [
          {
            text: "Social Media Interaction 📱",
            callback_data: "task_social_media",
          },
        ],
        [{ text: "Website Interactions 🌐", callback_data: "task_website" }],
        [{ text: "Watch Videos 🎥", callback_data: "task_watch_videos" }],
      ],
    },
  };
  await axios.post(url, message, {
    headers: { "Content-Type": "application/json" },
  });
}
async function handleUnrecognizedCommand(chatId) {
  const url = `${TELEGRAM_API}/sendMessage`;
  const message = {
    chat_id: chatId,
    text:
      "I'm sorry, I didn't recognize that command. Here are some commands you can use:\n\n" +
      formatCommandList(),
  };
  await axios.post(url, message, {
    headers: { "Content-Type": "application/json" },
  });
}
function formatCommandList() {
  let formattedList = "";
  for (const command in commandList) {
    formattedList += `${command} - ${commandList[command]}\n`;
  }
  return formattedList;
}
async function updateUserEarnings(chatId, additionalEarnings) {
  try {
    let user = await User.findOne({ chatId });

    if (user) {
      // Update the user's earnings
      user.earnings = (user.earnings || 0) + additionalEarnings;

      if (user.referralsId) {
        const referralArray = user.referralsId;
        console.log("Chat Ids: ", JSON.stringify(referralArray));
        //set the refEarnings to a fresh place holder
        user.refEarnings = 0;
        for (let i = 0; i < referralArray.length; i++) {
          const referralId = referralArray[i]; //id of a referral
          let referral = await User.findOne({ chatId: referralId });
          if (referral) {
            console.log("Referral earning: %s", referral.earnings);
            let earningsFromReferral = 0.02 * referral.earnings; // 2% of a referrals earnings
            user.refEarnings += earningsFromReferral;
          }
        }
        user.coins = 0;
        user.coins = (user.earnings + user.refEarnings) / 0.4;
      }

      await user.save();
    }
  } catch (error) {
    console.error("Error updating earnings:", error);
  }
}
async function sendEarnings(chatId) {
  try {
    const user = await User.findOne({ chatId });

    if (user) {
      const earnings = user.earnings || 0;
      const refEarnings = user.refEarnings || 0;
      await sendMessage(
        chatId,
        `🥮 <b>RB Coins</b>: ${Number(user.coins).toFixed(
          2
        )}🥮\n\n💰 <b>Current earnings</b>: ₦${Number(
          earnings + refEarnings
        ).toFixed(2)}\n\n💸 <b>Referral earnings</b>: ₦${Number(
          refEarnings
        ).toFixed(2)}`
      );
    } else {
      await sendMessage(
        chatId,
        "No earnings found. Please participate in tasks to earn rewards."
      );
    }
  } catch (error) {
    await sendMessage(
      chatId,
      "An error occurred while fetching your earnings. Please try again."
    );
  }
}
async function requestName(chatId) {
  editing = true;
  const url = `${TELEGRAM_API}/sendMessage`;
  const message = {
    chat_id: chatId,
    text: "<b>This Process Will Alter Your Details</b>\n\nPlease enter your name and email separated by a space (e.g., John Doe john@example.com)\n[Enter <b>'cancel'</b> to stop the process]:",
  };
  await axios.post(url, message, {
    headers: { "Content-Type": "application/json" },
  });
}
async function handleContactInfo(chatId, text) {
  editing = true;
  let retry = true;

  if (text != "cancel") {
    while (retry) {
      // Define regex patterns
      const emailPattern =
        /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
      const namePattern = /^[A-Z][a-z]*$/;

      // Split the text by spaces
      const parts = text.trim().split(/\s+/);

      // Validate the format: exactly 3 parts
      if (parts.length !== 3) {
        await sendMessage(
          chatId,
          "Invalid format. Please provide your details in the format: John Doe johndoe@example.com"
        );
        return; // Exit the function to allow retry
      }

      const [firstName, lastName, email] = parts;

      // Validate first name and last name capitalization
      if (!namePattern.test(firstName) || !namePattern.test(lastName)) {
        await sendMessage(
          chatId,
          "Invalid name format. First name and last name must start with a capital letter and contain only letters."
        );
        return; // Exit the function to allow retry
      }

      // Validate email format
      if (!emailPattern.test(email)) {
        await sendMessage(
          chatId,
          "Invalid email format. Please provide a valid email address."
        );
        return; // Exit the function to allow retry
      }

      // Save the contact information to the user document
      let user = await User.findOne({ chatId });

      if (!user) {
        // If the user doesn't exist, create a new user document
        user = new User({ chatId });
      }

      // Update user's profile with the provided name and email
      user.profile.name = `${firstName} ${lastName}`;
      user.profile.email = email;
      await user.save();

      // After saving contact info, send confirmation message to the user
      await sendMessage(
        chatId,
        "🔧 <b>Successfully updated details</b>\n\nYour details have been updated. Type /start to view dashboard."
      );

      retry = false; // Exit loop
    }

    editing = false; // Reset editing flag after exiting the loop
  } else {
    sendMessage(
      chatId,
      "The process was succesfully canceled and your details remain unchanged"
    );
  }
}
async function requestAndSaveUser(chatId, referrerId = null) {
  // Request the user's name
  await requestName(chatId);

  // Create a new user document and assign the referrer if provided
  const user = new User({ chatId });
  if (referrerId) {
    // Increment referrals count for referrer
    let referrer = await User.findOne({ chatId: referrerId });
    if (referrer) {
      // handle updating referrals
      referrer.referrals = (referrer.referrals || 0) + 1; // update the number of referrals
      referrer.referralsId.push(String(chatId));
      await referrer.save();
    }
  }

  // Save the user document
  await user.save();
}
async function handleStartCommand(chatId, referrerId) {
  // Check if user exists
  let user = await User.findOne({ chatId });

  if (!user) {
    if (referrerId) {
      if (String(chatId) === referrerId) {
        // Send a warning message if the user tries to refer themselves
        console.warn("Potential spam alert, self refer");
        await sendSelfReferWarning(chatId, "self_refer");
      } else {
        // Request the user's name and save the user with the referrer
        await sendWelcomeMessage(chatId);
        await requestAndSaveUser(chatId, referrerId);
      }
    } else {
      // Request the user's name and save the user without a referrer
      await sendWelcomeMessage(chatId);
      await requestAndSaveUser(chatId);
    }
  } else {
    // User already exists
    if (referrerId) {
      if (String(chatId) === referrerId) {
        // Send a warning message if the user tries to refer themselves
        console.warn("Potential spam alert, self refer");
        await sendSelfReferWarning(chatId, "self_refer");
      } else {
        // Send a warning if the user already has a referrer (indicating they were referred before)
        console.warn("Potential spam alert, multiple accounts");
        await sendSelfReferWarning(chatId, "link_refer");
      }
    } else {
      // No referrerId provided, handle as needed (possibly request name or show dashboard)
      await sendWelcomeMessage(chatId);
    }
  }
}
async function handleDashboardCommand(chatId) {
  // Check if user exists
  let user = await User.findOne({ chatId });

  // If user does not exist, prompt to provide name and email
  if (!user) {
    await requestName(chatId);
    return;
  }

  // If user exists, send the dashboard welcome message directly
  await sendDashboardWelcome(chatId);
}

module.exports = {
  getEditing: () => editing,
  setEditing: (value) => {
    editing = value;
  },
  sendContactBoard,
  sendPrivacyPolicy,
  sendTermsConditions,
  sendDisclaimer,
  sendMessage,
  sendProfile,
  sendReferLink,
  sendTaskOptions,
  handleUnrecognizedCommand,
  updateUserEarnings,
  sendEarnings,
  requestName,
  handleContactInfo,
  handleStartCommand,
  handleDashboardCommand,
};
