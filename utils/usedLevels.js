const { postLevelUsed } = require("./getPostLevelLeftCount");
const {} = require("./totalPostFromActiveSubscription");

const usedPostTypes = async (user_id, post_type_id) => {
  const used = await postLevelUsed(user_id, post_type_id);
  return used;
};

module.exports.usedPostTypes = usedPostTypes;
