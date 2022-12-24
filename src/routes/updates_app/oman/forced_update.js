const router = require("express").Router();
const forceUpdate = require("../../../model/updates_app/oman/forced_update.js");

// GET ALL UPDATES LIST
router.get("/app-updates", async (req, res) => {
  try {
    const updates = await forceUpdate.find({ forced_update: true });

    if (!updates)
      return res.status(404).send({
        code: 404,
        message: "no recoreds found",
        result: null,
      });

    return res.status(200).json({
      code: 200,
      message: updates.length + " recoreds found",
      result: updates,
    });
  } catch (error) {
    res.status(400).json({ code: 200, message: error.message, result: [] });
  }
});

module.exports = router;
