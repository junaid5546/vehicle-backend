const model = require("../src/model/vehicle_for_sale/oman/posts/vehicleForSalePost.model");
const ObjectId = require("mongoose").Types.ObjectId;

const getPostsById = async (matchObj, skip, limit, sortType) => {
  const data = await model
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
          post_status: {
            $toObjectId: "$post_status",
          },
        },
      },
      {
        $match: matchObj,
      },
      {
        $sort: sortType ?? {
          price: 1,
        },
      },
      {
        $skip: skip ?? 0,
      },
      {
        $limit: limit ?? 10,
      },
      {
        $lookup: {
          from: "vehicles_filters",
          localField: "condition_id",
          foreignField: "types._id",
          as: "conditionObject",
        },
      },
      {
        $lookup: {
          from: "vehicles_filters",
          localField: "sale_type_id",
          foreignField: "types._id",
          as: "saleTypeObject",
        },
      },
      {
        $lookup: {
          from: "vehicles_filters",
          localField: "exterior_color_id",
          foreignField: "types._id",
          as: "exteriorColorObject",
        },
      },
      {
        $lookup: {
          from: "vehicles_filters",
          localField: "seats_type_id",
          foreignField: "types._id",
          as: "seatsTypeObject",
        },
      },
      {
        $lookup: {
          from: "vehicles_filters",
          localField: "interior_color_id",
          foreignField: "types._id",
          as: "interiorColorObject",
        },
      },
      {
        $lookup: {
          from: "vehicles_filters",
          localField: "cylinder_count_id",
          foreignField: "types._id",
          as: "cylinderCountObject",
        },
      },
      {
        $lookup: {
          from: "vehicles_filters",
          localField: "fuel_type_id",
          foreignField: "types._id",
          as: "fuelTypeObject",
        },
      },
      {
        $lookup: {
          from: "vehicles_filters",
          localField: "drivetrain_id",
          foreignField: "types._id",
          as: "driveTrainObject",
        },
      },
      {
        $lookup: {
          from: "vehicles_filters",
          localField: "transmission_type_id",
          foreignField: "types._id",
          as: "transmissionTypeObject",
        },
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
          from: "vehicles_filters",
          localField: "warranty_duration_id",
          foreignField: "types._id",
          as: "warrantyDurationObject",
        },
      },
      {
        $lookup: {
          from: "vehicles_filters",
          localField: "insurance_type_id",
          foreignField: "types._id",
          as: "insuranceTypeObject",
        },
      },
      {
        $lookup: {
          from: "vehicles_filters",
          localField: "readiness_id",
          foreignField: "types._id",
          as: "readinessObject",
        },
      },
      {
        $lookup: {
          from: "vehicles_filters",
          localField: "plate_type_id",
          foreignField: "types._id",
          as: "plateTypeObject",
        },
      },
      {
        $lookup: {
          from: "vehicles_filters",
          localField: "year_id",
          foreignField: "types._id",
          as: "yearObject",
        },
      },
      {
        $lookup: {
          from: "posts_statuses",
          localField: "post_status",
          foreignField: "_id",
          as: "post_status",
        },
      },
      {
        $lookup: {
          let: {
            userObjId: {
              $toObjectId: "$user_id",
            },
          },
          from: "users_records",
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", "$$userObjId"],
                },
              },
            },
          ],
          as: "userDetails",
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
          from: "vehicles_filters",
          localField: "engine_size",
          foreignField: "types._id",
          as: "engineSizeObject",
        },
      },
      {
        $lookup: {
          from: "vehicles_filters",
          localField: "door_count_id",
          foreignField: "types._id",
          as: "doorCountObject",
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
        $lookup: {
          from: "locations_states",
          localField: "state_id",
          foreignField: "_id",
          as: "state_id",
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
          let: {
            levelObjId: {
              $toObjectId: "$level_id.id",
            },
          },
          from: "master_post_level_singles",
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", "$$levelObjId"],
                },
              },
            },
          ],
          as: "levelObject",
        },
      },
      {
        $lookup: {
          let: {
            userObjId: {
              $map: {
                input: "$features_id_array",
                in: {
                  $toObjectId: "$$this",
                },
              },
            },
          },
          from: "vehicles_features",
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ["$_id", "$$userObjId"],
                },
              },
            },
          ],
          as: "featuersList",
        },
      },
      {
        $lookup: {
          from: "master_post_status",
          localField: "status_code",
          foreignField: "statusCode",
          as: "statusCode",
        },
      },
      {
        $set: {
          conditionList: {
            $arrayElemAt: ["$conditionObject", 0],
          },
          statusCode: {
            $arrayElemAt: ["$statusCode", 0],
          },
          saleTypeList: {
            $arrayElemAt: ["$saleTypeObject", 0],
          },
          exteriorColorList: {
            $arrayElemAt: ["$exteriorColorObject", 0],
          },
          seatsTypeList: {
            $arrayElemAt: ["$seatsTypeObject", 0],
          },
          interiorColorList: {
            $arrayElemAt: ["$interiorColorObject", 0],
          },
          cylinderCountList: {
            $arrayElemAt: ["$cylinderCountObject", 0],
          },
          fuelTypeList: {
            $arrayElemAt: ["$fuelTypeObject", 0],
          },
          driveTrainList: {
            $arrayElemAt: ["$driveTrainObject", 0],
          },
          transmissionTypeList: {
            $arrayElemAt: ["$transmissionTypeObject", 0],
          },
          originList: {
            $arrayElemAt: ["$originObject", 0],
          },
          warrantyDurationList: {
            $arrayElemAt: ["$warrantyDurationObject", 0],
          },
          insuranceTypeList: {
            $arrayElemAt: ["$insuranceTypeObject", 0],
          },
          readinessList: {
            $arrayElemAt: ["$readinessObject", 0],
          },
          plateTypeList: {
            $arrayElemAt: ["$plateTypeObject", 0],
          },
          yearList: {
            $arrayElemAt: ["$yearObject", 0],
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
          governorate: {
            $arrayElemAt: ["$governorate", 0],
          },
          state: {
            $arrayElemAt: ["$state_id", 0],
          },
          levelDetails: {
            $arrayElemAt: ["$levelObject", 0],
          },
          engineSizeObject: {
            $arrayElemAt: ["$engineSizeObject", 0],
          },
          doorCountObject: {
            $arrayElemAt: ["$doorCountObject", 0],
          },
          trimObject: {
            $arrayElemAt: ["$trimObject", 0],
          },
          post_type: {
            $arrayElemAt: ["$post_type_object", 0],
          },
          post_status: {
            $arrayElemAt: ["$post_status", 0],
          },
        },
      },
      {
        $set: {
          year: {
            $arrayElemAt: [
              {
                $filter: {
                  input: "$yearList.types",
                  as: "item",
                  cond: {
                    $eq: ["$$item._id", "$year_id"],
                  },
                },
              },
              0,
            ],
          },
          plateType: {
            $arrayElemAt: [
              {
                $filter: {
                  input: "$plateTypeList.types",
                  as: "item",
                  cond: {
                    $eq: ["$$item._id", "$plate_type_id"],
                  },
                },
              },
              0,
            ],
          },
          readiness: {
            $arrayElemAt: [
              {
                $filter: {
                  input: "$readinessList.types",
                  as: "item",
                  cond: {
                    $eq: ["$$item._id", "$readiness_id"],
                  },
                },
              },
              0,
            ],
          },
          condition: {
            $arrayElemAt: [
              {
                $filter: {
                  input: "$conditionList.types",
                  as: "item",
                  cond: {
                    $eq: ["$$item._id", "$condition_id"],
                  },
                },
              },
              0,
            ],
          },
          saleType: {
            $arrayElemAt: [
              {
                $filter: {
                  input: "$saleTypeList.types",
                  as: "item",
                  cond: {
                    $eq: ["$$item._id", "$sale_type_id"],
                  },
                },
              },
              0,
            ],
          },
          exteriorColor: {
            $arrayElemAt: [
              {
                $filter: {
                  input: "$exteriorColorList.types",
                  as: "item",
                  cond: {
                    $eq: ["$$item._id", "$exterior_color_id"],
                  },
                },
              },
              0,
            ],
          },
          seatsType: {
            $arrayElemAt: [
              {
                $filter: {
                  input: "$seatsTypeList.types",
                  as: "item",
                  cond: {
                    $eq: ["$$item._id", "$seats_type_id"],
                  },
                },
              },
              0,
            ],
          },
          interiorColor: {
            $arrayElemAt: [
              {
                $filter: {
                  input: "$interiorColorList.types",
                  as: "item",
                  cond: {
                    $eq: ["$$item._id", "$interior_color_id"],
                  },
                },
              },
              0,
            ],
          },
          cylinderCount: {
            $arrayElemAt: [
              {
                $filter: {
                  input: "$cylinderCountList.types",
                  as: "item",
                  cond: {
                    $eq: ["$$item._id", "$cylinder_count_id"],
                  },
                },
              },
              0,
            ],
          },
          fuelType: {
            $arrayElemAt: [
              {
                $filter: {
                  input: "$fuelTypeList.types",
                  as: "item",
                  cond: {
                    $eq: ["$$item._id", "$fuel_type_id"],
                  },
                },
              },
              0,
            ],
          },
          driveTrain: {
            $arrayElemAt: [
              {
                $filter: {
                  input: "$driveTrainList.types",
                  as: "item",
                  cond: {
                    $eq: ["$$item._id", "$drivetrain_id"],
                  },
                },
              },
              0,
            ],
          },
          transmissionType: {
            $arrayElemAt: [
              {
                $filter: {
                  input: "$transmissionTypeList.types",
                  as: "item",
                  cond: {
                    $eq: ["$$item._id", "$transmission_type_id"],
                  },
                },
              },
              0,
            ],
          },
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
          warrantyDuration: {
            $arrayElemAt: [
              {
                $filter: {
                  input: "$warrantyDurationList.types",
                  as: "item",
                  cond: {
                    $eq: ["$$item._id", "$warranty_duration_id"],
                  },
                },
              },
              0,
            ],
          },
          insuranceType: {
            $arrayElemAt: [
              {
                $filter: {
                  input: "$insuranceTypeList.types",
                  as: "item",
                  cond: {
                    $eq: ["$$item._id", "$insurance_type_id"],
                  },
                },
              },
              0,
            ],
          },
          user: {
            $arrayElemAt: ["$userDetails", 0],
          },
          engineSizeObject: {
            $arrayElemAt: [
              {
                $filter: {
                  input: "$engineSizeObject.types",
                  as: "item",
                  cond: {
                    $eq: ["$$item._id", "$engine_size"],
                  },
                },
              },
              0,
            ],
          },
          doorCountObject: {
            $arrayElemAt: [
              {
                $filter: {
                  input: "$doorCountObject.types",
                  as: "item",
                  cond: {
                    $eq: ["$$item._id", "$door_count_id"],
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
          items: [
            {
              key: "Make",
              api_key: "make_id",
              value: {
                nameEn: {
                  $ifNull: ["$make.name.en", null],
                },
                nameAr: {
                  $ifNull: ["$make.name.ar", null],
                },
                _id: {
                  $ifNull: ["$make._id", null],
                },
              },
            },
            {
              key: "Model",
              api_key: "model_id",
              value: {
                nameEn: {
                  $ifNull: ["$modelsList.name.en", null],
                },
                nameAr: {
                  $ifNull: ["$modelsList.name.ar", null],
                },
                _id: {
                  $ifNull: ["$modelsList._id", null],
                },
              },
            },
            {
              key: "Trim",
              api_key: "trim_id",
              value: {
                nameEn: {
                  $ifNull: ["$trimObject.name.en", null],
                },
                nameAr: {
                  $ifNull: ["$trimObject.name.ar", null],
                },
                _id: {
                  $ifNull: ["$trimObject._id", null],
                },
              },
            },
            {
              key: "Model Year",
              api_key: "year_id",
              value: {
                nameEn: {
                  $ifNull: ["$year.nameEn", null],
                },
                nameAr: {
                  $ifNull: ["$year.nameAr", null],
                },
                _id: {
                  $ifNull: ["$year._id", null],
                },
              },
            },
            {
              key: "Condition",
              api_key: "condition_id",
              value: {
                nameEn: {
                  $ifNull: ["$condition.nameEn", null],
                },
                nameAr: {
                  $ifNull: ["$condition.nameAr", null],
                },
                _id: {
                  $ifNull: ["$condition._id", null],
                },
              },
            },
            {
              key: "Exterior Color",
              api_key: "exterior_color_id",

              value: {
                nameEn: {
                  $ifNull: ["$exteriorColor.nameEn", null],
                },
                nameAr: {
                  $ifNull: ["$exteriorColor.nameAr", null],
                },
                _id: {
                  $ifNull: ["$exteriorColor._id", null],
                },
              },
            },
            {
              key: "Engine Size",
              api_key: "engine_size",

              value: {
                nameEn: {
                  $ifNull: ["$engineSizeObject.nameEn", null],
                },
                nameAr: {
                  $ifNull: ["$engineSizeObject.nameEn", null],
                },
                _id: {
                  $ifNull: ["$engineSizeObject._id", null],
                },
              },
            },
            {
              key: "Doors",
              api_key: "door_count_id",

              value: {
                nameEn: {
                  $ifNull: ["$doorCountObject.nameEn", null],
                },
                nameAr: {
                  $ifNull: ["$doorCountObject.nameEn", null],
                },
                _id: {
                  $ifNull: ["$doorCountObject._id", null],
                },
              },
            },
            {
              key: "Cylinders",
              api_key: "cylinder_count",

              value: {
                nameEn: {
                  $ifNull: ["$cylinderCount.nameEn", null],
                },
                nameAr: {
                  $ifNull: ["$cylinderCount.nameAr", null],
                },
                _id: {
                  $ifNull: ["$cylinderCount._id", null],
                },
              },
            },
            {
              key: "Fuel",
              api_key: "fuel_type_id",

              value: {
                $ifNull: ["$fuelType", null],
              },
            },
            {
              key: "Transmission",
              api_key: "transmission_type_id",

              value: {
                $ifNull: ["$transmissionType", null],
              },
            },
            {
              key: "Drivetrain",
              api_key: "drivetrain_id",

              value: {
                $ifNull: ["$driveTrain", null],
              },
            },
            {
              key: "Interior Color",
              api_key: "interior_color_id",
              value: {
                nameEn: {
                  $ifNull: ["$interiorColor.nameEn", null],
                },
                nameAr: {
                  $ifNull: ["$interiorColor.nameAr", null],
                },
                _id: {
                  $ifNull: ["$interiorColor._id", null],
                },
              },
            },
            {
              key: "Seats",
              api_key: "seats_type_id",
              value: {
                $ifNull: ["$seatsType", null],
              },
            },
            {
              key: "Origin",
              api_key: "origin_id",

              value: {
                $ifNull: ["$origin", null],
              },
            },
            {
              key: "Body",
              api_key: "body_id",

              value: {
                nameEn: {
                  $ifNull: ["$body.nameEn", null],
                },
                nameAr: {
                  $ifNull: ["$body.nameAr", null],
                },
                _id: {
                  $ifNull: ["$body._id", null],
                },
              },
            },
            {
              key: "State",
              api_key: "state_id",

              value: {
                nameEn: "$state.nameEn",
                nameAr: "$state.nameAr",
                _id: "$state._id",
              },
            },
            {
              key: "Governorate",
              api_key: "governorate_id",
              value: {
                nameEn: "$governorate.nameEn",
                nameAr: "$governorate.nameAr",
                _id: "$governorate._id",
              },
            },
            {
              key: "Location",
              value: {
                nameEn: {
                  $concat: [
                    {
                      $ifNull: ["$state.nameEn", null],
                    },
                    ", ",
                    {
                      $ifNull: ["$governorate.nameEn", null],
                    },
                  ],
                },
                nameAr: {
                  $concat: [
                    {
                      $ifNull: ["$state.nameAr", null],
                    },
                    "، ",
                    {
                      $ifNull: ["$governorate.nameAr", null],
                    },
                  ],
                },
              },
            },
            {
              key: "Warranty Duration",
              api_key: "warranty_duration_id",
              value: {
                $ifNull: ["$warrantyDuration", null],
              },
            },
            {
              key: "Warranty Kilometer",
              api_key: "warranty_kilometer",

              value: {
                nameEn: {
                  $ifNull: ["$warranty_kilometer", null],
                },
                nameAr: {
                  $ifNull: ["$warranty_kilometer", null],
                },
              },
            },
            {
              key: "Insurance",
              api_key: "insurance_type_id",
              value: {
                $ifNull: ["$insuranceType", null],
              },
            },
            {
              key: "Plate Type",
              api_key: "plate_type_id",
              value: {
                $ifNull: ["$plateType", null],
              },
            },
            {
              key: "Driving Readiness",
              api_key: "readiness_id",
              value: {
                $ifNull: ["$readiness", null],
              },
            },
            {
              key: "Sale Type",
              api_key: "sale_type_id",

              value: {
                $ifNull: ["$saleType", null],
              },
            },
            {
              key: "Distance Travelled",
              api_key: "distance_kilometer",
              value: {
                nameEn: {
                  $concat: ["$km", " Kilometers ", "$ml", " Miles "],
                },
                nameAr: {
                  $concat: ["$km", " ميل ", "$ml", " كيلومتر "],
                },
              },
            },
            {
              key: "Distance Kilometer",
              api_key: "distance_kilometer",
              value: {
                nameEn: {
                  $ifNull: ["$distance_kilometer", null],
                },
                nameAr: {
                  $ifNull: ["$distance_kilometer", null],
                },
              },
            },
            {
              key: "Distance Mile",
              api_key: "distance_mile",
              value: {
                nameEn: {
                  $ifNull: ["$distance_mile", null],
                },
                nameAr: {
                  $ifNull: ["$distance_mile", null],
                },
              },
            },
          ],
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
                $ifNull: ["$year.nameEn", ""],
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
                $ifNull: ["$year.nameAr", ""],
              },
              modelShown: { $arrayElemAt: ["$modelsObject.modelShown", 0] },
            },
          },
          post_status: {
            en: { $ifNull: ["$post_status.statusEn", "Pending Review"] },
            ar: { $ifNull: ["$post_status.statusAr", "قيد المراجهة"] },
            _id: { $ifNull: ["$post_status._id", "627925bfda535aadb15ef3d5"] },
          },
          price: {
            $ifNull: ["$price", null],
          },
          featuersList: {
            $ifNull: ["$featuersList", null],
          },

          sellerNotes: {
            $ifNull: ["$seller_notes", null],
          },
          postId: {
            $ifNull: ["$postId", null],
          },
          user: {
            _id: {
              $ifNull: ["$user._id", null],
            },
            userpublicId: {
              $ifNull: ["$user.user_index", null],
            },
            post_counts: {
              $ifNull: ["$user.vfs_count", null],
            },
            phoneBusiness: {
              $ifNull: ["$user.phoneBusiness", null],
            },
            governorate_id: {
              $ifNull: ["$user.businessGovernorate", null],
            },
            state_id: {
              $ifNull: ["$user.businessState", null],
            },
            businessImage: {
              $ifNull: ["$user.businessImage.url", null],
            },
            primaryPhone: {
              $ifNull: ["$user.primaryPhone", null],
            },
            firstName: {
              $ifNull: ["$user.firstName", null],
            },
            lastName: {
              $ifNull: ["$user.lastName", null],
            },
          },
          mediaList: {
            $ifNull: ["$mediaList", null],
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
          },
          user_governate: "$user.businessGovernorate",
          user_state: "$user.businessState",
          km: 1,
        },
      },
      {
        $set: {
          user_governate: {
            $toObjectId: "$user_governate",
          },
          user_state: {
            $toObjectId: "$user_state",
          },
        },
      },
      {
        $lookup: {
          from: "locations_governorates",
          localField: "user_governate",
          foreignField: "_id",
          as: "user_governate",
        },
      },
      {
        $lookup: {
          from: "locations_states",
          localField: "user_state",
          foreignField: "_id",
          as: "user_state",
        },
      },
      {
        $set: {
          user_governate: {
            $first: "$user_governate",
          },
          user_state: {
            $first: "$user_state",
          },
        },
      },
    ])
    .allowDiskUse(false);
  return data;
};
module.exports.getPostsById = getPostsById;
