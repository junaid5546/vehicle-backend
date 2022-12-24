const mongoose = require("mongoose");

const maintenance_mode_schema = new mongoose.Schema(
  {
    maintenance_mode: {
      type: Boolean,
    },
    operating_system: {
      type: String,
    },
    name: {
      en: {
        type: String,
      },
      ar: {
        type: String,
      },
    },
    destination: {
      type: String,
    },
    image: {
      type: String,
    },
    versions: {
      type: Array,
    },
  },
  { collection: "maintenance_mode", timestamps: true }
);

module.exports = mongoose.model("maintenance_mode", maintenance_mode_schema);
