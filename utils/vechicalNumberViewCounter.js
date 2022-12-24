const {
  VIEWS_TYPES,
} = require("../src/constants/vehicles_for_sale/ViewsCounter.JS");

const vehiclesNumbersPostsSchema = require("../src/model/vehicles_numbers/om/vehicles_numbers_posts/vehiclesNumbersPosts.model.js");

const viewsCounterVehiclesNumberPost = async (id, countType) => {
  const selectData =
    countType === VIEWS_TYPES.POST_PAGE
      ? "view_count"
      : countType === VIEWS_TYPES.CHAT_COUNT
      ? "chat_count"
      : countType === VIEWS_TYPES.WHATSAPP_COUNT
      ? "whatsapp_count"
      : "call_count";

  const countViewPost = await vehiclesNumbersPostsSchema
    .findById(id)
    .select(selectData);
  if (countType === VIEWS_TYPES.POST_PAGE) {
    countViewPost.view_count = countViewPost.view_count + 1;
  } else if (countType === VIEWS_TYPES.CHAT_COUNT) {
    countViewPost.chat_count = countViewPost.chat_count + 1;
  } else if (countType === VIEWS_TYPES.WHATSAPP_COUNT) {
    countViewPost.whatsapp_count = countViewPost.whatsapp_count + 1;
  } else if (countType === VIEWS_TYPES.CALLS_COUNT) {
    countViewPost.call_count = countViewPost.call_count + 1;
  } else {
    return;
  }
  countViewPost.save();
};

module.exports.viewsCounterVehiclesNumberPost = viewsCounterVehiclesNumberPost;
