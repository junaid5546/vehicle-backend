const mongoose = require("mongoose");

const homepage_banners_om = new mongoose.Schema(
  {
    userId: { type: String },
    profileId: { type: String },
    imageEn: { type: Object, required: true },
    imageAr: { type: Object, required: true },
    price: { type: Number, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    externslUrl: { type: String, required: true },
    postId: { type: String, required: true },
    customPageId: { type: String, required: true },
    statusId: { type: String, required: true },
    viewCount: { type: Number, required: true, default: 0 },
  },
  { collection: "homepage_banners", timestamps: true }
);

module.exports = mongoose.model("homepage_banners", homepage_banners_om);
