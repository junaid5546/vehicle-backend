const router = require("express").Router();
const terms_and_conditions = require("../../model/terms_conditions/terms_conditions");

//GET ALL REPORT REASON LIST
router.get("/terms-conditions", async (req, res) => {
  try {
    const terms_conditions = await terms_and_conditions.find();

    if (!terms_conditions)
      return res.status(400).send({
        code: 400,
        message: "no recoreds found",
        result: null,
      });

    return res.status(200).json({
      code: 200,
      message: terms_conditions?.length ?? 0 + " recoreds found",
      result: terms_conditions,
    });
  } catch (error) {
    res.status(400).json({ code: 400, message: error.message, result: [] });
  }
});

module.exports = router;
