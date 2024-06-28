const express = require("express");
const User = require("../models/user");
const router = express.Router();

router.post("/claim-airtime", async (req, res) => {
  const { chatId, number } = req.body;

  try {
    if (chatId) {
      const user = await User.findOne({ chatId });
      if (user) {
        if (user.validToken) {
          const credentials = {
            apiKey:
              "atsk_6277df76c54182d147190d4003488391f239772d9c39bebcb457a19241c3a9557e5ee93d",
            username: "sandbox",
          };
          const AfricasTalking = require("africastalking")(credentials);
          const airtime = AfricasTalking.AIRTIME;

          const options = {
            recipients: [
              {
                phoneNumber: `${number}`,
                currencyCode: "NGN", // modify this later
                amount: 100,
              },
            ],
          };

          airtime
            .send(options)
            .then((response) => {
              user.validToken = false;
              console.log(response);
            })
            .catch((error) => {
              console.log(error);
            });
          res.json({ message: "Airtime claimed successfully!" });
          await user.save();
        }
      }
    }
  } catch (error) {
    console.error("Error claiming airtime:", error);
    res
      .status(500)
      .json({ message: "Failed to claim airtime. Please try again later." });
  }
});

module.exports = router;
