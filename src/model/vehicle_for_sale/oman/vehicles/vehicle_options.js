const mongoose = require("mongoose");

const vehicleMasterSchema = new mongoose.Schema(
  {
    nameEn: { type: String, default: "" },
    nameAr: { type: String, default: "" },
    makeLogo: { type: String, default: "" },
    models: [
      {
        nameEn: { type: String, default: "" },
        nameAr: { type: String, default: "" },
        modelShown: { type: Boolean, default: true },
        trims: [
          {
            nameEn: { type: String, default: "" },
            nameAr: { type: String, default: "" },
            bodyID: [
              // {
              //   type: String,
              //   default: "",
              // },
              {
                type: mongoose.Schema.Types.ObjectId,
                ref: "vehicles_bodies",
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
  { collection: "vehicles_master_feeds", versionKey: false }
);

vehicleMasterSchema.plugin(require("mongoose-autopopulate"));
module.exports = mongoose.model("vehicles_master_feeds", vehicleMasterSchema);
