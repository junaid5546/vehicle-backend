const router = require("express").Router();
const maintenance_mode = require("../../../model/updates_app/oman/maintenance_mode.js");

// GET ALL UPDATES LIST
router.get("/app-maintenance", async (req, res) => {
  try {
    const updates = await maintenance_mode.find({ forced_update: true });
    if (!updates)
      return res.status(404).send({
        code: 400,
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
