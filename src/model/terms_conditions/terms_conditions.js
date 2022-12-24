const mongoose = require("mongoose");

const terms_conditions = new mongoose.Schema(
  {
    body: {
      en: {
        type: String,
      },
      ar: {
        type: String,
      },
    },
    title: {
      en: {
        type: String,
      },
      ar: {
        type: String,
      },
    },
  },
  { collection: "terms_and_conditions" }
);

module.exports = mongoose.model("terms_and_conditions", terms_conditions);
