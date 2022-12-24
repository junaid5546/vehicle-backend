const mongoose = require("mongoose");

const UserPrivateProfileView = new mongoose.Schema({
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
  favourite: { any: Array },
  vehicles_for_sale_posts: { any: Array },
});

module.exports = mongoose.model(
  "users_private_profile_view",
  UserPrivateProfileView,
  "users_private_profile_view"
);
