const VFSPostViewSchema = require("../src/model/vehicle_for_sale/oman/views/vehicleForSalePost.view");
const { postSequence } = require("./postFilterSecquence.js");
const ObjectId = require("mongoose").Types.ObjectId;

const get_bodies_models = async (key) => {
  const data = await VFSPostViewSchema.aggregate([
    {
      $unwind: {
        path: "$filterItem",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $match: { "filterItem.key": key },
    },
    {
      $group: {
        _id: { filterItem: "$filterItem.value" },
        filterItem: {
          $first: "$filterItem",
        },
      },
    },
    {
      $group: {
        _id: null,
        result: { $push: "$filterItem.value" },
      },
    },
  ]);
  return data[0]?.result?.filter((e) => e != null);
};

const getFilterbyQuries = async (post_status, bodies, models, userId, lang) => {
  const filterData = {};
  const queryObj = {};
  queryObj["user._id"] = ObjectId(userId);
  queryObj.post_status = { $in: post_status };

  if (bodies && !models) {
    queryObj.$and = [
      {
        filterItem: {
          $elemMatch: { value: { $in: bodies } },
        },
      },
    ];
  }
  if (models && bodies) {
    queryObj.$and = [
      {
        filterItem: {
          $elemMatch: { value: { $in: bodies } },
        },
      },
      {
        filterItem: {
          $elemMatch: { value: { $in: models } },
        },
      },
    ];
  }

  const posts = await VFSPostViewSchema.find(queryObj);
  return posts.map((e) => {
    return postSequence(e, lang);
  });
};
module.exports.get_bodies_models = get_bodies_models;
module.exports.getFilterbyQuries = getFilterbyQuries;
