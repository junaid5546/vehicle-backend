const router = require("express").Router();
const locationschema = require("../../../model/locatons/oman/locations.model");

// -------------------  locations AND STATES APIs -----------------------
// GET ALL locations
router.get("/states", async (req, res) => {
  try {
    const govList = await locationschema.find();
    if (!govList)
      return res.status(404).json({
        code: 404,
        message: "no records found",
        result: [],
      });

    res.json({
      code: 200,
      message: govList.length + "records found",
      result: govList,
    });
  } catch (error) {
    res.status(400).json({ code: 400, message: error.message, result: [] });
  }
});

module.exports = router;
