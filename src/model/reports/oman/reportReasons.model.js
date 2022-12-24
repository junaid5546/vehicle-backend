const mongoose = require("mongoose");

const ReportReasonSchema = new mongoose.Schema({
  report_reason_en: {
    type: String,
  },
  report_reason_ar: {
    type: String,
  },
});

module.exports = mongoose.model("posts_reports_reasons", ReportReasonSchema);
