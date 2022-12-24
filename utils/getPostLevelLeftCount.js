const subscriptions = require("../src/model/users/subscriptions/users_subscriptions_records_om");
var isodate = require("isodate");
const moment = require("moment");

const postLevelUsed = async (user_id, post_type_id) => {
  const count = await subscriptions.aggregate([
    [
      {
        $match: {
          user_id: user_id,
        },
      },
      {
        $unwind: {
          path: "$posts_types_records",
        },
      },
      {
        $match: {
          "posts_types_records.subscription.subscription_expiryDate": {
            $gte: isodate(moment(Date.now()).format()?.toString()),
          },
          "posts_types_records.post_type_id": post_type_id,
        },
      },
      {
        $count: "post_type_id",
      },
    ],
  ]);
  return count[0]?.post_type_id ?? 0;
};

module.exports.postLevelUsed = postLevelUsed;
