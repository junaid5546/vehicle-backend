const mongoose = require("mongoose");
const date = new Date();
date.setDate(date.getDate() + 5);
const { v4: uuidv4 } = require("uuid");
const autoIncrement = require("mongoose-auto-increment");
var connection = mongoose.createConnection(process.env.MONGODB_URI);

const userSubscriptionRecordSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users_records",
      autopopulate: true,
      default: null,
    },
    status: {
      type: Boolean,
      default: false,
    },
    sub_index: { type: Number, default: 0 },
    user_subscriptons: {
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
      assigned_by: {
        type: String,
      },
      subscription_id: {
        type: String,
      },
      price: {
        type: Number,
      },
      payment_mode: {
        type: String,
      },
      type: {
        type: String,
        default: "Free",
      },
      offersId: [
        {
          type: String,
        },
      ],
      post_types: [
        {
          post_type_id: { type: String },
          count: { type: Number },
          remaining: { type: Number },
          price: { type: Number },
          key: { type: String },
          type: { type: String },
        },
      ],
      posts_republish_count: { type: Number },
    },
  },
  { collection: "users_quotations_records" },
  { timestamps: true }
);

userSubscriptionRecordSchema.plugin(require("mongoose-autopopulate"));
autoIncrement.initialize(connection);

userSubscriptionRecordSchema.plugin(autoIncrement.plugin, {
  model: "users_quotations_records",
  field: "sub_index",
  startAt: 100,
  incrementBy: 1,
});
module.exports = mongoose.model(
  "users_quotations_records",
  userSubscriptionRecordSchema
);
