const mongoose = require("mongoose");

const vehiclesNumbersLettersOm = new mongoose.Schema(
  {
    letterEn: { type: String },
    letterAr: { type: String },
  },
  { collection: "vehicles_numbers_letters" }
);

module.exports = mongoose.model(
  "vehicles_numbers_letters",
  vehiclesNumbersLettersOm
);
