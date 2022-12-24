const mongoose = require("mongoose");
const date = new Date();
date.setDate(date.getDate() + 5);
const { v4: uuidv4 } = require("uuid");

const userSubscriptionRecordSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
    },

    user_subscriptons: [
      {
        sub_id: {
          type: Number,
        },
        subscription_id: {
          type: String,
        },
        assigned_by: {
          type: String,
        },
        price: {
          type: Number,
        },
        payment_mode: {
          type: String,
        },
        start_date: {
          type: Date,
          default: Date.now(),
        },
        end_date: {
          type: Date,
          default: date,
        },
        type: {
          type: String,
          default: "Free",
        },
        additional_fee: [
          {
            price: {
              type: Number,
            },
            notes: {
              type: String,
            },
          },
        ],
        additional_discount: [
          {
            price: {
              type: Number,
            },
            notes: {
              type: String,
            },
          },
        ],

        post_types: [
          {
            post_type_id: {
              type: String,
              // type: mongoose.Schema.Types.ObjectId,
              // ref: "posts_types",
              // autopopulate: true,
              // default: null,
            },
            count: { type: Number },
            remaining: { type: Number },
          },
        ],
        posts_republish_count: { type: Number },
      },
    ],
    posts_types_records: [
      {
        post_id: { type: String },
        post_type_id: { type: String },
        start_date: {
          type: Date,
          default: Date.now(),
        },
        expiryDate: {
          type: Date,
          default: date,
        },
        subscription: {
          subscription_id: {
            type: String,
          },
          subscription_start_date: {
            type: Date,
          },
          subscription_expiryDate: {
            type: Date,
          },
        },
      },
    ],

    posts_republished_records: [
      {
        post_id: { type: String },
        post_type_id: { type: String },
        republished_date: {
          type: Date,
          default: Date.now(),
        },
        subscription: {
          subscription_id: {
            type: String,
          },
          subscription_start_date: {
            type: Date,
          },
          subscription_expiryDate: {
            type: Date,
          },
        },
      },
    ],

    one_time_purchases: [
      {
        post_id: { type: String },
        post_type_id: { type: String },
        price: { type: Number },
        start_date: {
          type: Date,
          default: Date.now(),
        },
        expiryDate: {
          type: Date,
          default: date,
        },
      },
    ],
    one_time_purchases_republish: [
      {
        post_id: { type: String },
        post_type_id: { type: String },
        price: { type: Number },
        republished_date: {
          type: Date,
          default: Date.now(),
        },
      },
    ],
  },
  { collection: "users_subscriptions_records" },
  { timestamps: true }
);
userSubscriptionRecordSchema.plugin(require("mongoose-autopopulate"));
userSubscriptionRecordSchema.plugin(require("mongoose-autopopulate"));
module.exports = mongoose.model(
  "users_subscriptions_records",
  userSubscriptionRecordSchema
);
