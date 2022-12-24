const mongoose = require("mongoose");

const subscriptionDepartmentSchema = new mongoose.Schema({
  nameEn: { type: String },
  nameAr: { type: String },
});

module.exports = mongoose.model("departments", subscriptionDepartmentSchema);
