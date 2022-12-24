const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const FiltersSchena = new mongoose.Schema({
  nameEn: String,
  nameAr: String,
  addVehicleOrder: Number,
  filterOrder: Number,
  types: [
    {
      index_id: { type: Number },
      nameEn: { type: String },
      nameAr: { type: String },
      filterNameEn: { type: String },
      name: { type: String },
      cssHex: { type: String },
      error: { type: String },
      errorEn: { type: String },
      errorAr: { type: String },
      minTravelledDistance: { type: Number },
    },
  ],
});

FiltersSchena.plugin(mongoosePaginate);

module.exports = mongoose.model("vehicles_filters", FiltersSchena);
