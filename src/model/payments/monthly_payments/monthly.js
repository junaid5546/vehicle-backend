const mongoose = require("mongoose");

const paymentPlansSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
    },
    type: {
      type: String,
    },
    subscription_id: {
      type: String,
    },
    month: {
      type: String,
      // required: true,
    },
    method: {
      type: String,
      // required: true,
    },
    value: {
      type: String,
      // required: true,
    },
    Employee_index_id: {
      type: String,
    },
    recieved_amount: {
      type: Number,
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
  { collection: "payments", timestamps: true }
);

module.exports = mongoose.model("payments", paymentPlansSchema);
