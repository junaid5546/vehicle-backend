const mongoose = require("mongoose");

const users_subscriptions_offers = new mongoose.Schema(
  {
    user_id: {
      type: String,
    },
    offers_avial: [
      {
        active: {
          type: Number,
          default: false,
        },
        offerId: {
          type: String,
        },
        offerStartDate: {
          type: String,
        },
        offerEndDate: {
          type: String,
        },
      },
    ],
  },
  { collection: "users_subscriptions_offers_records", timestamps: true }
);

module.exports = mongoose.model(
  "users_subscriptions_offers_records",
  users_subscriptions_offers
);
