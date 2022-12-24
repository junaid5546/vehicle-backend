const mongoose = require("mongoose");

const trimsSchema = new mongoose.Schema(
  {
    model_id: { type: mongoose.Schema.Types.ObjectId },
    name: { en: { type: String }, ar: { type: String } },
    bodyID: [{ type: mongoose.Schema.Types.ObjectId }],
    engineSize: [{ type: mongoose.Schema.Types.ObjectId }],
    index_id: { type: Number },
  },
  { collection: "vehicles_trims", versionKey: false }
);

module.exports = mongoose.model("vehicles_trims", trimsSchema);
