const mongoose = require("mongoose");

const modelsSchema = new mongoose.Schema(
  {
    make_id: { type: mongoose.Schema.Types.ObjectId },
    name: { en: { type: String }, ar: { type: String } },
    modelShown: { type: Boolean },
    index_id: { type: Number },
  },

  { collection: "vehicles_models", versionKey: false }
);

module.exports = mongoose.model("vehicles_models", modelsSchema);
