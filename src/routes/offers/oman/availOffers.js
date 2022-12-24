const router = require("express").Router();
const offers = require("../../../model/offers/oman/offerAvailed.js");

// -------------------  offers AND STATES APIs -----------------------
// GET ALL offers
router.get("/availed-offers", async (req, res) => {
  try {
    const offerList = await offers.findOne();
    res.json({
      code: 200,
      message: "offers founded",
      result: offerList,
    });
  } catch (error) {
    res.status(400).json({ code: 400, message: error.message, result: [] });
  }
});

// ADD NEW OFFERS
router.post("/avail-offers", async (req, res) => {
  try {
    const newOffer = new offers(req.body);
    const saveOffer = await newOffer.save();
    res.json({
      code: 200,
      message: "new offer added successfully",
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
