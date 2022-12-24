const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const vehicles_for_sale_kilometrage_errorSchena = new mongoose.Schema({
  year: {
    type: String,
  },
  distance_kilometer_min_value: {
    type: String,
  },
  kilometrage_error_en: {
    type: String,
  },
  kilometrage_error_ar: {
    type: String,
  },
});

vehicles_for_sale_kilometrage_errorSchena.plugin(mongoosePaginate);
module.exports = mongoose.model(
  "vehicles_for_sale_kilometrage_errors",
  vehicles_for_sale_kilometrage_errorSchena
);
