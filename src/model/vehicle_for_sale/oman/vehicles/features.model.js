const mongoose = require("mongoose");

const featuresSchema = new mongoose.Schema(
  {
    featureEn: { type: String },
    featureAr: { type: String, required: true },
    image: { type: String },
  },

  { collection: "vehicles_features", timestamps: true }
);

module.exports = mongoose.model("vehicles_features", featuresSchema);
