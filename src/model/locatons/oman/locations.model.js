const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
  nameEn: {
    type: String,
  },
  nameAr: {
    type: String,
  },
  states: [
    {
      nameEn: { type: String },
      nameAr: { type: String },
      governate_id: { type: String },
    },
  ],
});

module.exports = mongoose.model("locations", locationSchema);
