const mongoose = require("mongoose");

const userView = new mongoose.Schema({
  userpublicId: { type: Number },
  accountType: { type: String },
  primaryPhone: {
    areaCode: { type: Number },
    phoneNumber: { type: Number },
  },
  phoneBusiness: {
    areaCode: { type: Number },
    phoneNumber: { type: Number },
  },
  firstName: { type: String },
  lastName: { type: String },
  personalImage: { type: String },
  businessImage: { type: String },
  businessName: { type: String },
  businessCR: { type: Number },
  businessTaxId: { type: Number },
  businessGovernorate: {
    nameEn: { type: String },
    nameAr: { type: String },
  },
  businessState: {
    nameEn: { type: String },
    nameAr: { type: String },
  },
  businessTown: {
    nameEn: { type: String },
    nameAr: { type: String },
  },
  langitude: { type: Number },
  latitude: { type: Number },
  profileViews: { type: Number },
  accountViews: { type: Number },
  favourite: [{ type: String }],
  followingUserId: [{ type: String }],
  followersUserId: [{ type: String }],
  colorMode: { type: String },
  language: { type: String },
});

module.exports = mongoose.model("users_view", userView, "users_view");
