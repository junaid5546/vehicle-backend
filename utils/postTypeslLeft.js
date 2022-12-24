const { postLevelUsed } = require("./getPostLevelLeftCount");
const {
  totalPostLevelsFromActiveSubscriptions,
} = require("./totalPostFromActiveSubscription");

const postTypeLefts = async (user_id, post_type_id) => {
  const used = await postLevelUsed(user_id.toString(), post_type_id.toString());
  const total = await totalPostLevelsFromActiveSubscriptions(
    user_id.toString(),
    post_type_id.toString()
  );
  return total - used;
};

module.exports.postTypeLefts = postTypeLefts;
