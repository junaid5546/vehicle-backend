const subscriptions = require("../src/model/users/subscriptions/users_subscriptions_records_om");
var isodate = require("isodate");
const moment = require("moment");

const getUserCurrentRepublishSubscription = async (user_id) => {
  const records = await subscriptions.aggregate([
    {
      $match: {
        user_id: user_id,
      },
    },
    {
      $unwind: {
        path: "$user_subscriptons",
      },
    },
    {
      $match: {
        "user_subscriptons.posts_republish_count": {
          $gt: 0,
        },
        "user_subscriptons.end_date": {
          $gte: isodate(moment(Date.now()).format().toString()),
        },
      },
    },
    {
      $project: {
        subscriptions: "$user_subscriptons",
      },
    },
  ]);

  const posts_republished_records = await subscriptions
    .find({ user_id: user_id })
    .select("posts_republished_records");

  const republish = posts_republished_records[0]?.posts_republished_records;
  const subs = records?.map((e) => e?.subscriptions);

  const getUsedPostTypesBySubscriptions = (e) => {
    const records = republish?.filter(
      (e2) => e2?.subscription?.subscription_id === e
    );
    return records?.length ?? 0;
  };

  const filterSubscriptions = subs?.map((e) => {
    e.usedCount = getUsedPostTypesBySubscriptions(e?.subscription_id);
    return e;
  });

  const activeSubscriptions = filterSubscriptions?.filter(
    (e) => e?.usedCount < e?.posts_republish_count
  );

  const sortedDesc = activeSubscriptions?.sort(
    (objA, objB) => Number(objB?.start_date) + Number(objA?.start_date)
  );

  const afilter = sortedDesc?.sort(
    (objA, objB) => Number(objB?.usedCount) - Number(objA?.usedCount)
  );

  // const activeSubscriptions = records[0]?.subscriptions;
  return afilter[0];
};

module.exports.getUserCurrentRepublishSubscription =
  getUserCurrentRepublishSubscription;
