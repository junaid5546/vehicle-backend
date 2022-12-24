const model = require("../src/model/vehicle_for_sale/oman/posts/vehicleForSalePost.model");
const ObjectId = require("mongoose").Types.ObjectId;

const getPosts = async (matchObj, skip, limit, sortKey, sortVal) => {
  const data2 = await model
    .aggregate([
      {
        $set: {
          condition_id: {
            $toObjectId: "$condition_id",
          },
          door_count_id: {
            $toObjectId: "$door_count_id",
          },
          body_id: {
            $toObjectId: "$body_id",
          },
          cylinder_count_id: {
            $toObjectId: "$cylinder_count_id",
          },
          drivetrain_id: {
            $toObjectId: "$drivetrain_id",
          },
          engine_size: {
            $toObjectId: "$engine_size",
          },
          exterior_color_id: {
            $toObjectId: "$exterior_color_id",
          },
          fuel_type_id: {
            $toObjectId: "$fuel_type_id",
          },
          governorate_id: {
            $toObjectId: "$governorate_id",
          },
          insurance_type_id: {
            $toObjectId: "$insurance_type_id",
          },
          interior_color_id: {
            $toObjectId: "$interior_color_id",
          },
          make_id: {
            $toObjectId: "$make_id",
          },
          model_id: {
            $toObjectId: "$model_id",
          },
          origin_id: {
            $toObjectId: "$origin_id",
          },
          plate_type_id: {
            $toObjectId: "$plate_type_id",
          },
          readiness_id: {
            $toObjectId: "$readiness_id",
          },
          sale_type_id: {
            $toObjectId: "$sale_type_id",
          },
          seats_type_id: {
            $toObjectId: "$seats_type_id",
          },
          state_id: {
            $toObjectId: "$state_id",
          },
          transmission_type_id: {
            $toObjectId: "$transmission_type_id",
          },
          trim_id: {
            $toObjectId: "$trim_id",
          },
          warranty_duration_id: {
            $toObjectId: "$warranty_duration_id",
          },
          year_id: {
            $toObjectId: "$year_id",
          },
        },
      },
      {
        $lookup: {
          from: "posts_types",
          localField: "post_type.id",
          foreignField: "_id",
          as: "post_type_object",
        },
      },
      {
        $lookup: {
          from: "vehicles_years",
          localField: "year_id",
          foreignField: "_id",
          as: "yearObject",
        },
      },
      {
        $set: {
          post_type: {
            $arrayElemAt: ["$post_type_object", 0],
          },
          year: {
            $arrayElemAt: ["$yearObject.nameEn", 0],
          },
        },
      },
      {
        $sort: {
          "post_type.order": 1,
          [sortKey]: sortVal,
        },
      },
      {
        $match: matchObj,
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },

      {
        $lookup: {
          from: "vehicles_filters",
          localField: "origin_id",
          foreignField: "types._id",
          as: "originObject",
        },
      },

      {
        $lookup: {
          let: {
            bodyObjId: {
              $toObjectId: "$body_id",
            },
          },
          from: "vehicles_bodies",
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", "$$bodyObjId"],
                },
              },
            },
          ],
          as: "body",
        },
      },
      {
        $lookup: {
          from: "vehicles_makes",
          localField: "make_id",
          foreignField: "_id",
          as: "makeObject",
        },
      },
      {
        $lookup: {
          from: "vehicles_models",
          localField: "model_id",
          foreignField: "_id",
          as: "modelsObject",
        },
      },
      {
        $lookup: {
          from: "vehicles_trims",
          localField: "trim_id",
          foreignField: "_id",
          as: "trimObject",
        },
      },
      {
        $lookup: {
          from: "locations_states",
          localField: "state_id",
          foreignField: "_id",
          as: "state_id",
        },
      },
      {
        $lookup: {
          from: "locations_governorates",
          localField: "governorate_id",
          foreignField: "_id",
          as: "governorate",
        },
      },
      {
        $set: {
          originList: {
            $arrayElemAt: ["$originObject", 0],
          },

          body: {
            $arrayElemAt: ["$body", 0],
          },
          make: {
            $arrayElemAt: ["$makeObject", 0],
          },
          modelsList: {
            $arrayElemAt: ["$modelsObject", 0],
          },
          state: {
            $arrayElemAt: ["$state_id", 0],
          },
          post_type: {
            $arrayElemAt: ["$post_type_object", 0],
          },
          trimObject: {
            $arrayElemAt: ["$trimObject", 0],
          },
          mediaList: {
            $arrayElemAt: ["$mediaList", 0],
          },
          governorate: {
            $arrayElemAt: ["$governorate", 0],
          },
        },
      },
      {
        $set: {
          origin: {
            $arrayElemAt: [
              {
                $filter: {
                  input: "$originList.types",
                  as: "item",
                  cond: {
                    $eq: ["$$item._id", "$origin_id"],
                  },
                },
              },
              0,
            ],
          },
        },
      },
      {
        $set: {
          km: {
            $toString: "$distance_kilometer",
          },
          ml: {
            $toString: "$distance_mile",
          },
        },
      },
      {
        $project: {
          // modelsList: 1,
          origin: {
            en: { $ifNull: ["$origin.nameEn", ""] },
            ar: { $ifNull: ["$origin.nameAr", ""] },
            _id: { $ifNull: ["$origin._id", ""] },
          },
          state: {
            en: { $ifNull: ["$state.nameEn", ""] },
            ar: { $ifNull: ["$state.nameAr", ""] },
            _id: { $ifNull: ["$state._id", ""] },
          },
          distance_kilometer: {
            en: {
              $concat: ["$km", " Km"],
            },
            ar: {
              $concat: ["$km", " كم"],
            },
          },
          distance_mile: {
            en: {
              $concat: ["$ml", " ml"],
            },
            ar: {
              $concat: ["$ml", " ميل"],
            },
          },
          postId: "$postId",
          title: {
            en: {
              make: {
                $cond: [
                  {
                    $or: [
                      {
                        $eq: ["$make.name.en", "Other"],
                      },
                      {
                        $eq: ["$make.name.en", "No Make"],
                      },
                    ],
                  },
                  "",
                  {
                    $ifNull: ["$make.name.en", ""],
                  },
                ],
              },
              model: {
                $cond: [
                  {
                    $or: [
                      {
                        $eq: ["$modelsList.name.en", "Other"],
                      },
                      {
                        $eq: ["$modelsList.name.en", "No Model"],
                      },
                    ],
                  },
                  "",
                  {
                    $ifNull: ["$modelsList.name.en", ""],
                  },
                ],
              },
              trim: {
                $cond: [
                  {
                    $or: [
                      {
                        $eq: ["$trimObject.name.en", "Other"],
                      },
                      {
                        $eq: ["$trimObject.name.en", "No Trim"],
                      },
                      {
                        $eq: ["$trimObject.name.en", "Standard"],
                      },
                    ],
                  },
                  "",
                  {
                    $ifNull: ["$trimObject.name.en", ""],
                  },
                ],
              },
              year: {
                $ifNull: ["$year", ""],
              },
              modelShown: { $arrayElemAt: ["$modelsObject.modelShown", 0] },
            },
            ar: {
              make: {
                $cond: [
                  {
                    $or: [
                      {
                        $eq: ["$make.name.ar", "Other"],
                      },
                      {
                        $eq: ["$make.name.ar", "No Make"],
                      },
                    ],
                  },
                  "",
                  {
                    $ifNull: ["$make.name.ar", ""],
                  },
                ],
              },
              model: {
                $cond: [
                  {
                    $or: [
                      {
                        $eq: ["$modelsList.name.ar", "Other"],
                      },
                      {
                        $eq: ["$modelsList.name.ar", "No Model"],
                      },
                    ],
                  },
                  "",
                  {
                    $ifNull: ["$modelsList.name.ar", ""],
                  },
                ],
              },
              trim: {
                $cond: [
                  {
                    $or: [
                      {
                        $eq: ["$trimObject.name.ar", "Other"],
                      },
                      {
                        $eq: ["$trimObject.name.ar", "No Trim"],
                      },
                      {
                        $eq: ["$trimObject.name.ar", "Standard"],
                      },
                    ],
                  },
                  "",
                  {
                    $ifNull: ["$trimObject.name.ar", ""],
                  },
                ],
              },
              year: {
                $ifNull: ["$year", ""],
              },
              modelShown: { $arrayElemAt: ["$modelsObject.modelShown", 0] },
            },
          },
          price: {
            $ifNull: ["$price", null],
          },
          post_type: {
            en: {
              $ifNull: ["$post_type.nameEn", null],
            },
            ar: {
              $ifNull: ["$post_type.nameAr", null],
            },
            id: {
              $ifNull: ["$post_type._id", null],
            },
            order: {
              $ifNull: ["$post_type.order", null],
            },
            duration: {
              $ifNull: ["$post_type.durationDays", null],
            },
          },
          location: {
            en: {
              $ifNull: ["$state.nameEn", null],
            },
            ar: {
              $ifNull: ["$state.nameAr", null],
            },
          },
          mediaList: {
            $ifNull: ["$mediaList", null],
          },
        },
      },
    ])
    .allowDiskUse(false);

  const data = await model.aggregate([
    {
      $set: {
        condition_id: {
          $toObjectId: "$condition_id",
        },
        door_count_id: {
          $toObjectId: "$door_count_id",
        },
        body_id: {
          $toObjectId: "$body_id",
        },
        cylinder_count_id: {
          $toObjectId: "$cylinder_count_id",
        },
        drivetrain_id: {
          $toObjectId: "$drivetrain_id",
        },
        engine_size: {
          $toObjectId: "$engine_size",
        },
        exterior_color_id: {
          $toObjectId: "$exterior_color_id",
        },
        fuel_type_id: {
          $toObjectId: "$fuel_type_id",
        },
        governorate_id: {
          $toObjectId: "$governorate_id",
        },
        insurance_type_id: {
          $toObjectId: "$insurance_type_id",
        },
        interior_color_id: {
          $toObjectId: "$interior_color_id",
        },
        make_id: {
          $toObjectId: "$make_id",
        },
        model_id: {
          $toObjectId: "$model_id",
        },
        origin_id: {
          $toObjectId: "$origin_id",
        },
        plate_type_id: {
          $toObjectId: "$plate_type_id",
        },
        readiness_id: {
          $toObjectId: "$readiness_id",
        },
        sale_type_id: {
          $toObjectId: "$sale_type_id",
        },
        seats_type_id: {
          $toObjectId: "$seats_type_id",
        },
        state_id: {
          $toObjectId: "$state_id",
        },
        transmission_type_id: {
          $toObjectId: "$transmission_type_id",
        },
        trim_id: {
          $toObjectId: "$trim_id",
        },
        warranty_duration_id: {
          $toObjectId: "$warranty_duration_id",
        },
        year_id: {
          $toObjectId: "$year_id",
        },
      },
    },
    {
      $match: matchObj,
    },
    {
      $count: "year_id",
    },
  ]);

  return {
    count: data[0]?.year_id,
    data: data2,
  };
};
module.exports.getPosts = getPosts;
