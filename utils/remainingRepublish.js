const { userUsedRepublishCount } = require("./usedRepublishCount");
const { userTotalRepublishCount } = require("./usedRepublishedTotalCount");

const remainingRepublishCount = async (userId) => {
  const used = await userUsedRepublishCount(userId);
  const total = await userTotalRepublishCount(userId);
  return total - used;
};

module.exports.remainingRepublishCount = remainingRepublishCount;
