const subscriptions = require("../src/model/users/subscriptions/users_subscriptions_records_om");
var isodate = require("isodate");
const moment = require("moment");

const userUsedRepublishCount = async (userId) => {
  const usedRepublished = await subscriptions.aggregate([
    {
      $match: {
        user_id: userId?.toString(),
      },
    },
    {
      $unwind: {
        path: "$posts_republished_records",
      },
    },
    {
      $match: {
        "posts_republished_records.subscription.subscription_expiryDate": {
          $gte: isodate(moment(Date.now()).format().toString()),
        },
      },
    },
    {
      $count: "posts_republished_records",
    },
  ]);
  const used = usedRepublished[0]?.posts_republished_records ?? 0;
  return used;
};

module.exports.userUsedRepublishCount = userUsedRepublishCount;
