const router = require("express").Router();
const { fileCsv } = require("../../../../../utils/multer.js");
const featuresModelOM = require("../../../../model/vehicle_for_sale/oman/vehicles/features.model.js");
var parser = new (require("simple-excel-to-json").XlsParser)();

// Create FEATURE
router.post("/vehicles/feature", async (req, res) => {
  try {
    const newFeature = new featuresModelOM(req.body);
    const saveFeature = await newFeature.save();
    res.status(200).send({ saveFeature });
  } catch (error) {
    return res.status(400).json({
      code: 400,
      message: error.message,
      result: [],
    });
  }
});

// Get FEATURES
router.get("/vehicles/features", async (req, res) => {
  try {
    const features = await featuresModelOM.find();
    res.status(200).send({ features: features, code: 200 });
  } catch (error) {
    return res.status(400).json({
      code: 400,
      message: error.message,
      result: [],
    });
  }
});

// Get FEATURES
router.post("/upload/vehicles/features", fileCsv, async (req, res) => {
  try {
    const file = req.files[0];
    var doc = parser.parseXls2Json(file.path)[0];
    const uploadFeatures = await featuresModelOM.insertMany(doc);
    res.status(200).send({ features: uploadFeatures, code: 200 });
  } catch (error) {
    return res.status(400).json({
      code: 400,
      message: error.message,
      result: [],
    });
  }
});
module.exports = router;
