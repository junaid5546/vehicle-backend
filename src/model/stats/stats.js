const mongoose = require("mongoose");

const statSchema = new mongoose.Schema({
  nameEn: {
    type: String,
  },
  nameAr: {
    type: String,
  },
  value: {
    types: Number,
  },
  unit: {
    en: {
      type: String,
    },
    ar: {
      type: String,
    },
  },
  order: {
    types: Number,
  },
  attachment: {
    types: String,
  },
});

module.exports = mongoose.model("statistics", statSchema);
