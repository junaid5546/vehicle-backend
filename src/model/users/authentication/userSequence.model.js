const mongoose = require("mongoose");
const userSequence = new mongoose.Schema({
  _id: { type: String },
  sequence_value: { type: Number },
});
module.exports = mongoose.model("users_sequences", userSequence);
