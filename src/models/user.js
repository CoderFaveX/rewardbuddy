// models/User.js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  chatId: {
    type: String,
    required: true,
    unique: true,
  },
  referralsId: { type: [String], default: [] },
  referrals: {
    type: Number,
    default: 0,
  },
  earnings: {
    type: Number,
    default: 0,
  },
  refEarnings: {
    type: Number,
    default: 0,
  },
  biWeeklyActivity: {
    type: Number,
    default: 0,
  },
  validToken: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date,
    default: Date.now,
  },
  dailyLoginStreak: {
    type: Number,
    default: 0,
  },
  coins: {
    type: Number,
    default: 0,
  },
  totalAdsViewed: {
    type: Number,
    default: 0,
  },
  profile: {
    name: String,
    email: String,
  },
  paymentMethod: {
    bankName: String,
    accountNumber: String,
    accountName: String,
  },
  verificationStatus: {
    type: Boolean,
    default: false,
  },
  transactionHistory: [
    {
      type: {
        type: String,
        description: String,
        amount: Number,
        date: {
          type: Date,
          default: Date.now,
        },
      },
    },
  ],
  withdrawalRequests: [
    {
      amount: Number,
      status: String,
      requestDate: {
        type: Date,
        default: Date.now,
      },
      completionDate: Date,
    },
  ],
});

module.exports = mongoose.model("User", UserSchema);
