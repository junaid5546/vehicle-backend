const userSequence = require("../../../model/users/authentication/userSequence.model.js");

// FUNCTION FOR UPDATEING THE SEQUENTIAL OF THE POST ID
async function getValueForNextSequence(sequenceOfName) {
  var sequenceDoc = await userSequence.findOneAndUpdate(
    { _id: sequenceOfName },
    { $inc: { sequence_value: 1 } },
    { new: true }
  );
  return sequenceDoc.sequence_value;
}

module.exports = getValueForNextSequence;
