const subscriptions = require("../src/model/users/subscriptions/users_subscriptions_records_om");
var isodate = require("isodate");
const moment = require("moment");
const { postLevelUsed } = require("./getPostLevelLeftCount");

const getUserCurrentSubscription = async (id, user_id) => {
  const records = await subscriptions.aggregate([
    {
      $match: {
        user_id: user_id?.toString(),
      },
    },
    {
      $unwind: {
        path: "$user_subscriptons",
      },
    },
    {
      $unwind: {
        path: "$user_subscriptons.post_types",
      },
    },
    {
      $match: {
        "user_subscriptons.end_date": {
          $gte: isodate(moment(Date.now()).format()?.toString()),
        },
        "user_subscriptons.post_types.post_type_id": id,
        // "user_subscriptons.post_types.count": {
        //   $gte: 5,
        // },
      },
    },
    {
      $group: {
        _id: {
          user_subscriptons: "$user_subscriptons",
        },
      },
    },
  ]);

  const records_with_post_types = await subscriptions
    .find({ user_id: user_id })
    .select("posts_types_records");
  const types = records_with_post_types[0]?.posts_types_records ?? [];

  const subs = records?.map((e) => e._id);
  const getUsedPostTypesBySubscriptions = (e) => {
    const records = types?.filter(
      (e2) => e2.subscription.subscription_id === e
    );
    return records?.length ?? 0;
  };

  const filterSubscriptions = subs?.map((e) => {
    e.usedCount = getUsedPostTypesBySubscriptions(
      e.user_subscriptons.subscription_id
    );
    return e;
  });
  //;
  const activeSubscriptions = filterSubscriptions?.filter(
    (e) => e.usedCount < e?.user_subscriptons?.post_types?.count
  );

  const sortedDesc = activeSubscriptions?.sort(
    (objA, objB) => Number(objB?.start_date) + Number(objA?.start_date)
  );

  const afilter = sortedDesc.sort(
    (objA, objB) => Number(objB?.usedCount) - Number(objA?.usedCount)
  );
  return afilter[0];
};

module.exports.getUserCurrentSubscription = getUserCurrentSubscription;
