const mongoose = require("mongoose");
const postSequence = new mongoose.Schema({
  _id: { type: String },
  sequence_value: { type: Number },
});
module.exports = mongoose.model("posts_sequences", postSequence);
