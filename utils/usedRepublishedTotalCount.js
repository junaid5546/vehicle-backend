const subscriptions = require("../src/model/users/subscriptions/users_subscriptions_records_om");
var isodate = require("isodate");
const moment = require("moment");

const userTotalRepublishCount = async (userId) => {
  const totalCount = await subscriptions.aggregate([
    [
      {
        $match: {
          user_id: userId?.toString(),
        },
      },
      {
        $unwind: {
          path: "$user_subscriptons",
        },
      },
      {
        $match: {
          "user_subscriptons.end_date": {
            $gte: isodate(moment(Date.now()).format().toString()),
          },
        },
      },
      {
        $group: {
          _id: "$user_id",
          total: {
            $sum: "$user_subscriptons.posts_republish_count",
          },
        },
      },
    ],
  ]);
  const total = totalCount[0]?.total ?? 0;
  return total;
};

module.exports.userTotalRepublishCount = userTotalRepublishCount;
