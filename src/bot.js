const express = require("express");
const {
  getEditing,
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
} = require("./commands/base_commands");

const router = express.Router();

router.post("/webhook", async (req, res) => {
  const { message, callback_query } = req.body;

  if (message) {
    const chatId = message.chat.id;
    let text = message.text;

    // Trim any leading whitespace or extra characters
    text = text.trim();

    if (getEditing()) {
      await handleContactInfo(chatId, text);
    } else {
      // Handle /setprofile command
      if (text.startsWith("/setprofile")) {
        await requestName(chatId);
      } else if (text.startsWith("/profile")) {
        await updateUserEarnings(chatId, 0);
        await sendProfile(chatId);
      } else if (text.startsWith("/start")) {
        const params = text.split(" ");
        let referrerId = null;
        if (params.length > 1) {
          referrerId = params[1]; // Assuming the referrer ID is passed as a parameter
        }
        await handleStartCommand(chatId, referrerId);
      } else if (text.startsWith("/dashboard")) {
        await handleDashboardCommand(chatId);
      } else if (text.startsWith("/refer")) {
        await sendReferLink(chatId);
      } else if (text.startsWith("/tasks")) {
        await sendTaskOptions(chatId);
      } else if (text.startsWith("/contact_board")) {
        await sendContactBoard(chatId);
      } else {
        if (text.startsWith("/")) {
          // Handle unrecognized commands
          await handleUnrecognizedCommand(chatId);
        }
      }
    }
  }

  if (callback_query) {
    const chatId = callback_query.from.id;
    const data = callback_query.data;

    if (data === "profile") {
      await sendProfile(chatId);
    } else if (data === "refer") {
      await sendReferLink(chatId);
    } else if (data === "complete_tasks") {
      await sendTaskOptions(chatId); // Call function to send task options
    } else if (data === "check_earnings") {
      await updateUserEarnings(chatId, 0); // Example: update earnings when checking
      await sendEarnings(chatId);
    } else if (data === "withdraw") {
      await sendMessage(chatId, "You can withdraw your earnings...");
      // Implement logic to handle withdrawals
    } else if (data === "privacy_policy") {
      await sendPrivacyPolicy(chatId);
    } else if (data === "terms_conditions") {
      await sendTermsConditions(chatId);
    } else if (data === "disclaimer") {
      await sendDisclaimer(chatId);
    } else if (data === "contact_board") {
      await sendContactBoard(chatId);
    } else if (data === "edit_profile") {
      await requestName(chatId);
    } else if (data === "dashboard") {
      await handleDashboardCommand(chatId); // Handle "View Dashboard" button
    } else if (
      data === "task_paid_ads" ||
      data === "task_sponsored_posts" ||
      data === "task_social_media" ||
      data === "task_website" ||
      data === "task_watch_videos"
    ) {
      await sendMessage(chatId, "Coming Soon...");
    } else if (
      data === "phone_us" ||
      data === "email_us" ||
      data === "contact_ai"
    ) {
      await sendMessage(chatId, "These features will be installed soon...");
    }
  }

  res.sendStatus(200);
});

module.exports = router;
