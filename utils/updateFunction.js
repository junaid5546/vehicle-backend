const VFSPostSchema = require("../src/model/vehicle_for_sale/oman/posts/vehicleForSalePost.model.js");
const { getStats } = require("../src/socket/emitFunctions.js");
const user_subscriptions_record = require("../src/model/users/subscriptions/users_subscriptions_records_om");
const { getUserCurrentSubscription } = require("./userCurrentSubscription.js");
const post_type = require("../src/model/users/posts_types/post_types.js");
const { usedPostTypes } = require("./usedLevels.js");

const updateFunction = async (body, id, userId, io) => {
  const option = { new: true };
  const startDate = new Date();
  await VFSPostSchema.findByIdAndUpdate(
    { _id: id },
    {
      modifyRecord: {
        modifierId: userId,
        modifyAt: startDate,
      },
    },
    option
  );
  if (body.post_type) {
    const get_post_type = await post_type.findById(body?.post_type.id);

    const endData = new Date();
    const startDate = new Date();
    endData.setDate(endData.getDate() + get_post_type.durationDays);
    //getting his first subscription from is all active subscriptions
    const subscription = await getUserCurrentSubscription(
      get_post_type._id?.toString(),
      userId
    );

    const usedPostType = subscription?.usedCount;
    // await usedPostTypes(userId?._id, body.post_type.id);
    const TotalSubsctionCount =
      subscription?.user_subscriptons?.post_types?.count;
    // subscription?.user_subscriptons?.post_types?.count ?? 0;
    //check if he has subscription push the record to the subscription post_records with that subscription Id
    if (subscription && usedPostType < TotalSubsctionCount) {
      const addTosubscription = await user_subscriptions_record.findOne({
        user_id: userId,
      });
      //storing object for the post records in user subscription
      const recordObject = {
        post_id: id,
        post_type_id: get_post_type._id,
        subscription: {
          subscription_id: subscription.user_subscriptons.subscription_id,
          subscription_start_date: subscription.user_subscriptons.start_date,
          subscription_expiryDate: subscription.user_subscriptons.end_date,
        },
        startDate: startDate,
        endDate: endData,
      };
      //pushing the records into the records array in user subscribtion
      addTosubscription?.posts_types_records?.push(recordObject);
      addTosubscription?.save();
    } else {
      //if user don't has subscription make it one time pur
      const user_purchases = await user_subscriptions_record.findOne({
        user_id: userId,
      });
      const recordObject = {
        post_id: id,
        post_type_id: get_post_type._id,
        price: get_post_type.price,
        startDate: startDate,
        endDate: endData,
      };
      if (user_purchases) {
        user_purchases.one_time_purchases.push(recordObject);
        user_purchases.save();
      } else {
        const newObj = {
          user_id: userId,
          one_time_purchases: [recordObject],
        };
        const newRecord = new user_subscriptions_record(newObj);
        newRecord.save();
      }
    }
    body.post_type = {
      id: get_post_type._id,
      startDate: startDate,
      endDate: endData,
      order: get_post_type.order,
    };
    body.post_type_records = [
      {
        id: get_post_type._id,
        startDate: startDate,
        endDate: endData,
        order: get_post_type.order,
      },
    ];
  }
  if (body.post_status) {
    getStats(io);
  }
  body.active = true;
  return await VFSPostSchema.findByIdAndUpdate({ _id: id }, body, option);
};

module.exports.updateFunction = updateFunction;
