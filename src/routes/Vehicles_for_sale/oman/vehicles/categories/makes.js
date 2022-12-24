const router = require("express").Router();
const { fileCsv } = require("../../../../../../utils/multer.js");
const makes = require("../../../../../model/vehicle_for_sale/oman/vehicles/makes.js");
const models = require("../../../../../model/vehicle_for_sale/oman/vehicles/models.js");
const trims = require("../../../../../model/vehicle_for_sale/oman/vehicles/trims.js");
var parser = new (require("simple-excel-to-json").XlsParser)();
// Create FEATURE
router.get("/get-makes", async (req, res) => {
  try {
    const getMakes = await makes.find();
    const structureMake = getMakes.map((e) => {
      return {
        id: e._id,
        image: e.image,
        name: {
          en: e.name.en,
          ar: e.name.ar,
        },
        index_id: e.index_id,
      };
    });
    res
      .status(200)
      .send({ length: structureMake.length, makes: structureMake });
  } catch (error) {
    return res.status(400).json({
      code: 400,
      message: error.message,
      result: [],
    });
  }
});

router.get("/get-models", async (req, res) => {
  try {
    const getmodels = await models.find();
    const structuremodels = getmodels.map((e) => {
      return {
        id: e._id,
        make_id: e.make_id,
        name: {
          en: e.name.en,
          ar: e.name.ar,
        },
        index_id: e.index_id,
      };
    });
    res
      .status(200)
      .send({ length: structuremodels.length, models: structuremodels });
  } catch (error) {
    return res.status(400).json({
      code: 400,
      message: error.message,
      result: [],
    });
  }
});

router.get("/get-trims", async (req, res) => {
  try {
    const getTrims = await trims.find();
    const structureTrims = getTrims.map((e) => {
      return {
        id: e._id,
        model_id: e.model_id,
        bodyID: e.bodyID,
        engineSize: e.engineSize,
        name: {
          en: e.name.en,
          ar: e.name.ar,
        },
        index_id: e.index_id,
      };
    });
    res
      .status(200)
      .send({ length: structureTrims.length, models: structureTrims });
  } catch (error) {
    return res.status(400).json({
      code: 400,
      message: error.message,
      result: [],
    });
  }
});

router.post("/post-trims", async (req, res) => {
  try {
    const structureTrims = new trims({
      model_id: req.body.model_id,
      bodyID: req.body.bodyID,
      engineSize: req.body.engineSize,
      name: {
        en: req.body.name.en,
        ar: req.body.name.ar,
      },
      index_id: req.body.index_id,
    });
    await structureTrims.save();
    res
      .status(200)
      .send({ length: structureTrims.length, models: structureTrims });
  } catch (error) {
    return res.status(400).json({
      code: 400,
      message: error.message,
      result: [],
    });
  }
});

router.get("/update-models", fileCsv, async (req, res) => {
  try {
    const path = req.files[0].path;
    const data = parser.parseXls2Json(path)[0];
    const update = await Promise.all(
      data.map(async (e) => {
        await models.findOneAndUpdate(
          { "name.en": e.model_en },
          { modelShown: e.model_shown },
          { new: true }
        );
      })
    );
    res.status(200).send({ length: update.length, models: update });
  } catch (error) {
    return res.status(400).json({
      code: 400,
      message: error.message,
      result: [],
    });
  }
});

module.exports = router;
