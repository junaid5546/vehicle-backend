const mongoose = require("mongoose");

const subscription_types = new mongoose.Schema(
  {
    department_id: { type: String },
    key: { type: String },
    nameEn: { type: String },
    nameAr: { type: String },
    durationDays: { type: Number },
    order: { type: Number },
    price: { type: Number },
    durationOffset: { type: Number },
    hookEn: { type: String },
    hookAr: { type: String },
  },
  { collection: "posts_types", timestamps: true }
);

module.exports = mongoose.model("posts_types", subscription_types);
