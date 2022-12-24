const router = require("express").Router();

router.get("/health-check", async (req, res) => {
  try {
    res.json({
      code: 200,
      message: "API is healthy",
      result: "API is healthy",
    });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message, result: [] });
  }
});

module.exports = router;
