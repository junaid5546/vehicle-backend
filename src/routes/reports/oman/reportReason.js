const router = require("express").Router();
const { langHandler } = require("../../../../utils/languageHandler");
const ReportReasonSchema = require("../../../model/reports/oman/reportReasons.model");
const UserReportSchema = require("../../../model/reports/oman/userReports.model");
const {
  addReportReason,
  updateReportReason,
  createReport,
} = require("../../../validation.js");

// GET ALL REPORT REASON LIST
router.get("/report-reason", async (req, res) => {
  try {
    const reason = await ReportReasonSchema.find();

    if (!reason)
      return res.status(404).send({
        code: 404,
        message: "no recoreds found",
        result: null,
      });

    const response = await reason.map((e) => {
      return {
        name: {
          en: e?.report_reason_en,
          ar: e?.report_reason_ar,
        },
        _id: e._id,
      };
    });
    return res.status(200).json({
      code: 200,
      message: reason.length + " recoreds found",
      result: response,
    });
  } catch (error) {
    res.status(400).json({ code: 3, message: error.message, result: [] });
  }
});

// DELECT REPORT REASON
router.delete("/report-reason/:_id", async (req, res) => {
  if (!req.params._id) {
    return res.status(400).json({
      code: 400,
      message: "something went wrong",
      result: [],
    });
  }

  try {
    const reason = await ReportReasonSchema.findByIdAndDelete({
      _id: req.params._id,
    });

    if (!reason)
      return res.status(404).send({
        code: 404,
        message: "record not find",
        result: null,
      });

    res.json({
      code: 200,
      message: "recored deleted",
      result: null,
    });
  } catch (error) {
    res.status(400).json({ code: 3, message: error.message, result: [] });
  }
});

// ADD NEW REPORT REASON
router.post("/report-reason", async (req, res) => {
  // VALIDATE THE USER DETAILES BEFORE REGISTER IT
  const { error } = addReportReason(req.body);
  if (error)
    return res
      .status(400)
      .json({ code: 400, message: error.details[0].message, result: [] });

  // CREATE NEW USER
  const reason = new ReportReasonSchema({
    report_reason_en: req.body.report_reason_en,
    report_reason_ar: req.body.report_reason_ar,
  });

  try {
    const saveReason = await reason.save();
    res.json({
      code: 200,
      message: "reason saved successfully",
      result: saveReason,
    });
  } catch (error) {
    res.status(400).json({ code: 400, message: error.message, result: [] });
  }
});

// UPDATE REPORT REASON
router.put("/report-reason", async (req, res) => {
  // VALIDATE THE USER DETAILES BEFORE REGISTER IT
  const { error } = updateReportReason(req.body);
  if (error)
    return res
      .status(400)
      .json({ code: 400, message: error.details[0].message, result: [] });

  try {
    const updatedReason = await ReportReasonSchema.findByIdAndUpdate(
      {
        _id: req.body._id,
      },
      {
        $set: {
          report_reason_en: req.body.report_reason_en,
          report_reason_ar: req.body.report_reason_ar,
        },
      }
    );

    return res.json({
      code: 200,
      message: "Reason Updated successfully",
      result: [],
    });
  } catch (error) {
    return res.status(400).json({
      code: 400,
      message: error.message,
      result: [],
    });
  }
});

// ------------------------------------ USER REPORT APIs ----------------------------------

// CREATE NEW REPORT
router.post("/report", async (req, res) => {
  // VALIDATE THE USER DETAILES BEFORE REGISTER IT
  const { error } = createReport(req.body);
  if (error)
    return res
      .status(400)
      .json({ code: 400, message: error.details[0].message, result: [] });

  try {
    const report = new UserReportSchema({
      reportedBy: req.body.reported_by,
      postId: req.body.post_id,
      reasonId: req.body.reason_id,
      reportStatus: "open",
    });

    const saveReport = await report.save();

    res.json({
      code: 0,
      message: "report saved successfully",
      result: saveReport,
    });
  } catch (error) {
    res.status(400).json({ code: 400, message: error.message, result: [] });
  }
});

// DELETE REPORT
router.delete("/report/:_id", async (req, res) => {
  if (!req.params._id) {
    return res.status(400).json({
      code: 400,
      message: "something went wrong",
      result: [],
    });
  }

  try {
    const report = await UserReportSchema.findByIdAndDelete({
      _id: req.params._id,
    });

    if (!report)
      return res.status(200).send({
        code: 200,
        message: "no record found",
        result: null,
      });

    res.json({
      code: 200,
      message: "report deleted",
      result: null,
    });
  } catch (error) {
    res.status(400).json({ code: 400, message: error.message, result: [] });
  }
});

module.exports = router;
