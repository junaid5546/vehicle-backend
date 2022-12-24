const mongoose = require("mongoose");

const vehiclesNumbersOptionsOm = new mongoose.Schema(
  {
    nameEn: { type: String },
    nameAr: { type: String },
    types: [
      {
        _id: { type: String },
        nameEn: { type: String },
        nameAr: { type: String },
        value: { any: Object },
      },
    ],
  },
  { collection: "vehicles_numbers_options" }
);

module.exports = mongoose.model(
  "vehicles_numbers_options",
  vehiclesNumbersOptionsOm
);
