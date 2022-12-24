const mongoose = require("mongoose");

const vehicleBodies = new mongoose.Schema(
  {
    nameEn: { type: String },
    nameAr: { type: String },
    image: { type: String },
    minPrice: { type: Number },
    maxPrice: { type: Number },
    errorEn: { type: String },
    errorAr: { type: String },
    filtersId: [{ type: String }],
    doorCount: [{ type: String }],
    index_id: { type: Number },
  },
  { versionKey: false }
);

vehicleBodies.plugin(require("mongoose-autopopulate"));
module.exports = mongoose.model("vehicles_bodies", vehicleBodies);
