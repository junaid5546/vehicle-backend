const router = require("express").Router();
const { langHandler } = require("../../../../../utils/languageHandler.js");
const { bannerileUploader } = require("../../../../../utils/multer.js");
const homepage_banners_om = require("../../../../model/banners/home_page_banners/homepage_banners_om.js");
var fs = require("fs");

// Create Banner
router.post("/banner", bannerileUploader, async (req, res) => {
  try {
    const newArImg = req?.files?.imageAr[0].originalname;
    const newEnImg = req?.files?.imageEn[0].originalname;

    const imagesAr = `http://localhost:3000/homepage_banners/ar_${req?.files?.imageAr[0].originalname}`;
    const imagesEn = `http://localhost:3000/homepage_banners/en_${req?.files?.imageEn[0].originalname}`;
    req.body.imageAr = {
      url: imagesAr,
      originalname: newArImg,
    };
    req.body.imageEn = {
      url: imagesEn,
      originalname: newEnImg,
    };
    const newBanner = new homepage_banners_om(req.body);

    const saveBanner = await newBanner.save();
    res.status(200).send({ saveBanner });
  } catch (error) {
    return res.status(400).json({
      code: 400,
      message: error.message,
      result: [],
    });
  }
});

// Get Banners
router.get("/banners", async (req, res) => {
  try {
    const lang = req.header["lang"];
    const saveBanner = await homepage_banners_om.find();
    const secquence = saveBanner?.map((e) => {
      e.banner_url = langHandler(e.imageAr, e.imageEn, lang);
      return e;
    });

    res.status(200).send({ banners: secquence, code: 200 });
  } catch (error) {
    return res.status(400).json({
      code: 400,
      message: error.message,
      result: [],
    });
  }
});

// Get Banners
router.patch("/banners/:id", bannerileUploader, async (req, res) => {
  try {
    const body = req.body;
    const newArImg = req?.files?.imageAr[0].originalname;
    const newEnImg = req?.files?.imageEn[0].originalname;

    const imagesAr = `http://localhost:3000/homepage_banners/ar_${newArImg}`;
    const imagesEn = `http://localhost:3000/homepage_banners/en_${newEnImg}`;
    const savedBanner = await homepage_banners_om.findById(req.params.id);
    if (req?.files?.imageAr) {
      req.body.imageAr = {
        url: imagesAr,
        originalname: newArImg,
      };
      if (imagesAr !== savedBanner.imageAr.url) {
        fs.unlink(
          `assets/homepage_banners/ar_${savedBanner.imageAr.originalname}`,
          function (err) {}
        );
      }
    }
    if (req?.files?.imageEn) {
      req.body.imageEn = {
        url: imagesEn,
        originalname: newEnImg,
      };
      if (imagesEn !== savedBanner.imageEn.url) {
        fs.unlink(
          `assets/homepage_banners/ar_${savedBanner.imageEn.originalname}`,
          function (err) {}
        );
      }
    }

    const updatedBanner = await homepage_banners_om.findByIdAndUpdate(
      { _id: req.params.id },
      body,
      { new: true }
    );

    res.status(200).send({ updatedBanner: updatedBanner, code: 200 });
  } catch (error) {
    return res.status(400).json({
      code: 400,
      message: error.message,
      result: [],
    });
  }
});

module.exports = router;
