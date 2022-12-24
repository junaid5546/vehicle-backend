const router = require("express").Router();
const offers = require("../../../model/offers/oman/newOffers");

// -------------------  offers AND STATES APIs -----------------------
// GET ALL offers
router.get("/offers", async (req, res) => {
  try {
    const offerList = await offers.find();
    const structure = offerList?.map((e) => {
      return e;
    });
    res.json({
      code: 200,
      message: "offers founded",
      result: structure,
    });
  } catch (error) {
    res.status(400).json({ code: 400, message: error.message, result: [] });
  }
});

//ADD NEW OFFERS
router.post("/create-offers", async (req, res) => {
  try {
    const newOffer = new offers(req.body);
    const saveOffer = await newOffer.save();
    res.json({
      code: 200,
      message: "new Gov added successfully",
      result: saveOffer,
    });
  } catch (error) {
    res.status(400).json({
      code: 400,
      message: error.message,
      result: [],
    });
  }
});

router.post("/create-calculations", async (req, res) => {
  try {
    const newOffer = new offers(req.body);
    const saveOffer = await newOffer.save();
    res.json({
      code: 200,
      message: "new Gov added successfully",
      result: saveOffer,
    });
  } catch (error) {
    res.status(400).json({
      code: 400,
      message: error.message,
      result: [],
    });
  }
});

module.exports = router;
