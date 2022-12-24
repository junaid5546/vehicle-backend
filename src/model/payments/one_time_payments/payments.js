const mongoose = require("mongoose");

const installmentPlansSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
    },

    subscription_id: {
      type: String,
    },
    month: {
      type: String,
      // required: true,
    },
    year: {
      type: String,
      // required: true,
    },
    paid: {
      type: Boolean,
      // required: true,
    },
    due_date: {
      type: Date,
      // required: true,
    },
    paid_date: {
      type: Date,
      // required: true,
    },
    amount: {
      type: Number,
      // required: true,
    },
    grace_period: {
      type: Date,
      // required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("installment", installmentPlansSchema);
