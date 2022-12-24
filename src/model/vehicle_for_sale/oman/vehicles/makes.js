const mongoose = require("mongoose");

const makesSchema = new mongoose.Schema(
  {
    name: { en: { type: String }, ar: { type: String } },
    image: { type: String },
    index_id: { type: Number },
  },

  { collection: "vehicles_makes", versionKey: false }
);

module.exports = mongoose.model("vehicles_makes", makesSchema);
