const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema({
  reportedBy: { type: mongoose.Schema.Types.ObjectId },
  postId: { type: mongoose.Schema.Types.ObjectId },
  reasonId: { type: mongoose.Schema.Types.ObjectId },
  reportStatus: { type: String },
});

module.exports = mongoose.model("posts_reports_records", ReportSchema);
