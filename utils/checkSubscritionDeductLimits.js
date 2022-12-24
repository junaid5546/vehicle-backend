const { getUserCurrentSubscription } = require("./userCurrentSubscription");
const user_subscriptions = require("../src/model/user.subscription.model");

const check_Subscription_deduct_balance = async (id, userId) => {
  const subscription = await getUserCurrentSubscription(id, userId);
  const previousActiveSub = subscription[0]?.subscriptions;
  if (previousActiveSub) {
    await user_subscriptions.findByIdAndUpdate(
      { _id: previousActiveSub?._id },
      { remaining_ads_count: previousActiveSub?.remaining_ads_count - 1 },
      { new: true }
    );

    return true;
  } else {
    return false;
  }
};

module.exports.check_Subscription_deduct_balance =
  check_Subscription_deduct_balance;
