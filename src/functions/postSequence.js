const postSequence = require("../model/uitility_models/postSequence.model.js");

// FUNCTION FOR UPDATEING THE SEQUENTIAL OF THE POST ID
async function getValueForNextSequence(sequenceOfName) {
  var sequenceDoc = await postSequence.findOneAndUpdate(
    { _id: sequenceOfName },
    { $inc: { sequence_value: 1 } },
    { new: true }
  );

  return sequenceDoc.sequence_value;
}

module.exports = getValueForNextSequence;
