const mongoose = require("mongoose");

const forced_update_schema = new mongoose.Schema(
  {
    forced_update: {
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
  { collection: "forced_update", timestamps: true }
);

module.exports = mongoose.model("forced_update", forced_update_schema);
