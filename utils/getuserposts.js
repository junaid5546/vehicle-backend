const vfs = require("../src/model/vehicle_for_sale/oman/posts/vehicleForSalePost.model");
const { removeEmptyObject } = require("./removeEmptyObject");
const user_posts = async (userId, status) => {
  const getCount = await vfs.aggregate([
    {
      $match: {
        user_id: userId.toString(),
        post_status: {
          $in: status,
        },
      },
    },
    {
      $set: {
        body_id: {
          $toObjectId: "$body_id",
        },
        // model_id: {
        //   $toObjectId: "$model_id",
        // },
      },
    },
    {
      $lookup: {
        from: "vehicles_bodies",
        localField: "body_id",
        foreignField: "_id",
        as: "bodies",
      },
    },
    {
      $project: {
        body: {
          $first: "$bodies",
        },
        // model: {
        //   $first: "$models",
        // },
      },
    },
    {
      $project: {
        body: {
          name: {
            en: "$body.nameEn",
            ar: "$body.nameAr",
          },
          _id: "$body._id",
        },
      },
    },
    {
      $group: {
        _id: null,
        bodies: {
          $push: {
            name: "$body.name",
            _id: "$body._id",
          },
        },
      },
    },
  ]);

  const data = getCount?.map((e) => {
    return e.bodies;
  })[0];

  const data3 = removeEmptyObject(data);
  const bodies = [
    ...new Map(data3?.map((m) => [m._id?.toString(), m]))?.values(),
  ];

  const checkObj = bodies.map((e) => {
    e.name = Object.keys(e.name).length < 1 ? delete e.name : e.name;
    return e;
  });

  const res = bodies.filter((e) => Object.keys(e?.name).length > 0);

  return res;
};
const user_posts_models = async (car_bodies, userId, status) => {
  const getCount = await vfs.aggregate([
    {
      $match: {
        user_id: userId,
        body_id: {
          $in: car_bodies,
        },
        post_status: {
          $in: status,
        },
      },
    },
    {
      $set: {
        model_id: {
          $toObjectId: "$model_id",
        },
      },
    },
    {
      $lookup: {
        from: "vehicles_models",
        localField: "model_id",
        foreignField: "_id",
        as: "models",
      },
    },
    {
      $project: {
        model: {
          $first: "$models",
        },
      },
    },
    {
      $project: {
        name: {
          en: "$model.name.en",
          ar: "$model.name.ar",
        },
        _id: "$model._id",
      },
    },
    {
      $group: {
        _id: null,
        models: {
          $push: {
            name: "$name",
            _id: "$_id",
          },
        },
      },
    },
  ]);

  const data = getCount?.map((e) => {
    return e.models;
  })[0];

  const models = [
    ...new Map(data?.map((m) => [m._id?.toString(), m]))?.values(),
  ];

  return models;
};
module.exports.user_posts = user_posts;
module.exports.user_posts_models = user_posts_models;
