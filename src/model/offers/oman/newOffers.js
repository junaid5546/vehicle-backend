const mongoose = require("mongoose");

const newOffersPlansSchema = new mongoose.Schema(
  {
    nameEn: {
      type: String,
    },
    nameAr: {
      type: String,
    },
    quantity_required: {
      type: Number,
    },
    required_post_types: {
      type: Array,
    },
    earners_remaining: {
      type: Number,
    },
    earners_limit: {
      type: Number,
    },
    expiry_date: {
      type: Date,
    },
    start_date: {
      type: Date,
      default: Date.now(),
    },
    discount: [
      {
        countFrom: {
          type: Number,
        },
        countTo: {
          type: Number,
        },
        discount: {
          type: Number,
        },
      },
    ],
    discount_type: {
      type: Array,
    },
    hasPrice: {
      type: Boolean,
      default: false,
    },
    hasDiscount: {
      type: Boolean,
      default: true,
    },
    qulified: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: false,
    },
  },
  { collection: "subscriptions_offers", timestamps: true }
);

module.exports = mongoose.model("subscriptions_offers", newOffersPlansSchema);
