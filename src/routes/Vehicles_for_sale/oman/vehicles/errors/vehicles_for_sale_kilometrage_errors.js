const router = require("express").Router();
const kilometerErrors = require("../model/vehicles_for_sale_kilometrage_errors.js");
const { fileCsv } = require("../../../../../../utils/multer.js");
const { uploadJSONXlx } = require("../../../../../../utils/FilesExelToJson");

router.post("/kilometer-errors", fileCsv, async (req, res) => {
  const path = req.files[0].path;
  // const allWarranties = await kilometerErrors.
  const response = uploadJSONXlx(path, "year").map((e) => {
    const createKiloError = {
      year: e?.year,
      distance_kilometer_min_value: e?.distance_kilometer_min_value,
      kilometrage_error_en: e?.kilometrage_error_en,
      kilometrage_error_ar: e.kilometrage_error_ar,
    };
    return createKiloError;
  });
  const saveErrors =
    response.length > 0
      ? await kilometerErrors.insertMany(response)
      : "AlreadyExist";
  res.status(200).send({ code: 200, message: saveErrors });
});

router.post("/kilometer-errors", fileCsv, async (req, res) => {
  const path = req.files[0].path;
  // const allWarranties = await kilometerErrors.
  const response = uploadJSONXlx(path, "year").map((e) => {
    const createKiloError = {
      year: e?.year,
      distance_kilometer_min_value: e?.distance_kilometer_min_value,
      kilometrage_error_en: e?.kilometrage_error_en,
      kilometrage_error_ar: e.kilometrage_error_ar,
    };
    return createKiloError;
  });
  const saveErrors =
    response.length > 0
      ? await kilometerErrors.insertMany(response)
      : "AlreadyExist";
  res.status(200).send({ code: 200, message: saveErrors });
});

module.exports = router;
