const mongoose = require("mongoose");

const posts_statuses = new mongoose.Schema({
  statusEn: { type: String },
  statusAr: { type: String },
  // name: { type: String },
});

module.exports = mongoose.model("posts_statuses", posts_statuses);
