const mongoose = require("mongoose");

const vehicleMasterSchema = new mongoose.Schema(
  {
    index_id: { type: Number, default: "" },
    nameEn: { type: String, default: "" },
    nameAr: { type: String, default: "" },
    makeLogo: { type: String, default: "" },
    models: [
      {
        name: {
          en: { type: String, default: "" },
          ar: { type: String, default: "" },
        },
        index_id: { type: Number, default: "" },
        modelShown: { type: Boolean, default: true },
        trims: [
          {
            index_id: { type: Number, default: "" },
            name: {
              en: { type: String, default: "" },
              ar: { type: String, default: "" },
            },
            bodyID: [
              {
                type: mongoose.Schema.Types.ObjectId,
                ref: "vehicle_bodies",
                autopopulate: true,
                default: null,
              },
            ],
            engineSize: {
              type: Array,
            },
          },
        ],
      },
    ],
  },
  { collection: "master_vehicles_view", versionKey: false }
);

vehicleMasterSchema.plugin(require("mongoose-autopopulate"));
module.exports = mongoose.model("master_vehicles_view", vehicleMasterSchema);
