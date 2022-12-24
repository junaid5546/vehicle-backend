const mongoose = require("mongoose");

const postsStatusSchema = new mongoose.Schema({
  statusEn: { type: String },
  statusAr: { type: String },
});

module.exports = mongoose.model("posts_statuses", postsStatusSchema);
