const mongoose = require("mongoose");

const vehiclesNumbersPostsSchema = new mongoose.Schema(
  {
    postId: { type: Number },
    userId: { type: String },
    vehicleNumber: { type: Number },
    vehicleLetterId: { type: String },
    plateTypeId: { type: String },
    transferTypeId: { type: String },
    governorateId: { type: String },
    stateId: { type: String },
    price: { type: Number },
    numberCount: { type: Number },
    stateId: { type: String },
    post_status_id: { type: String },
    post_type: {
      id: { type: String },
      startDate: { type: Date },
      endDate: { type: Date },
      order: { type: Number },
    },
    post_status: { type: String },
    view_count: {
      type: Number,
      default: 0,
    },
    favorite_count: {
      type: Number,
      default: 0,
    },
    chat_count: {
      type: Number,
      default: 0,
    },
    whatsapp_count: {
      type: Number,
      default: 0,
    },
    call_count: {
      type: Number,
      default: 0,
    },
    sorting_date: {
      type: Date,
    },
    edit_records: {
      type: Array,
    },
  },
  { collection: "vehicles_numbers_posts", timestamps: true }
);

module.exports = mongoose.model(
  "vehicles_numbers_posts",
  vehiclesNumbersPostsSchema
);
