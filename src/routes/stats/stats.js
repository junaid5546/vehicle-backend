const router = require("express").Router();
const statistics_model = require("../../model/stats/stats");

// get statstics
router.get("/statistics", async (req, res) => {
  try {
    const statistics = await statistics_model.find();
    return res.status(200).json({
      code: 200,
      message: statistics.length + " recoreds found",
      result: statistics,
    });
  } catch (error) {
    res.status(200).json({ code: 3, message: error.message, result: [] });
  }
});

module.exports = router;
