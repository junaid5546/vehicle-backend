const subscriptions = require("../src/model/users/subscriptions/users_subscriptions_records_om");
const moment = require("moment");
var isodate = require("isodate");

const totalPostLevelsFromActiveSubscriptions = async (
  user_id,
  post_type_id
) => {
  const total_has_now = await subscriptions.aggregate([
    [
      {
        $match: {
          user_id: user_id.toString(),
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
        $unwind: {
          path: "$user_subscriptons.post_types",
        },
      },
      {
        $match: {
          "user_subscriptons.post_types.post_type_id": post_type_id,
        },
      },
      {
        $group: {
          _id: "$user_id",
          total: {
            $sum: "$user_subscriptons.post_types.count",
          },
        },
      },
    ],
  ]);
  return total_has_now[0]?.total ?? 0;
};

module.exports.totalPostLevelsFromActiveSubscriptions =
  totalPostLevelsFromActiveSubscriptions;
