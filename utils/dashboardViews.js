const model = require("../src/model/vehicle_for_sale/oman/posts/vehicleForSalePost.model");

const getDashboardViews = async (
  finalSearchingObj,
  skip,
  limit,
  sortType,
  status
) => {
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
        },
      },
      {
        $sort: sortType ?? {
          price: 1,
        },
      },
      {
        $match: finalSearchingObj,
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
          from: "posts_types",
          localField: "post_type._id",
          foreignField: "_id",
          as: "postTypeObj",
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
          let: {
            levelObjId: {
              $toObjectId: "$post_type.id",
            },
          },
          from: "posts_types",
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
          from: "vehicles_for_sale_features",
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
          from: "posts_statuses",
          localField: "post_status",
          foreignField: "_id",
          as: "status",
        },
      },
      {
        $set: {
          conditionList: {
            $arrayElemAt: ["$conditionObject", 0],
          },
          status: {
            $arrayElemAt: ["$status", 0],
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
        },
      },
      {
        $set: {
          // state: {
          //   $arrayElemAt: [
          //     {
          //       $filter: {
          //         input: "$governorate.states",
          //         as: "item",
          //         cond: {
          //           $eq: ["$$item._id", "$state_id"],
          //         },
          //       },
          //     },
          //     0,
          //   ],
          // },
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
        $project: {
          items: [
            {
              key: "Make",
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
              key: "Models",
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
              key: "Body",
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
              key: "Engine Size",
              value: {
                $ifNull: ["$engineSizeObject", null],
              },
            },
            {
              key: "Door",
              value: {
                $ifNull: ["$doorCountObject", null],
              },
            },
            {
              key: "Year",
              value: {
                $ifNull: ["$year", null],
              },
            },
            {
              key: "Condition",
              value: {
                $ifNull: ["$condition", null],
              },
            },
            {
              key: "Exterior Color",
              value: {
                $ifNull: ["$exteriorColor", null],
              },
            },
            {
              key: "Interior Color",
              value: {
                $ifNull: ["$interiorColor", null],
              },
            },
            {
              key: "Cylinder Count",
              value: {
                $ifNull: ["$cylinderCount", null],
              },
            },
            {
              key: "Fuel",
              value: {
                $ifNull: ["$fuelType", null],
              },
            },
            {
              key: "Transmission",
              value: {
                $ifNull: ["$transmissionType", null],
              },
            },
            {
              key: "Drivetrain",
              value: {
                $ifNull: ["$driveTrain", null],
              },
            },
            {
              key: "Seats",
              value: {
                $ifNull: ["$seatsType", null],
              },
            },
            {
              key: "Plate Type",
              value: {
                $ifNull: ["$plateType", null],
              },
            },
            {
              key: "Driving Readiness",
              value: {
                $ifNull: ["$readiness", null],
              },
            },
            {
              key: "Post Type",
              value: {
                _id: {
                  $ifNull: ["$levelDetails._id", null],
                },
                nameEn: {
                  $ifNull: ["$levelDetails.nameEn", null],
                },
                nameAr: {
                  $ifNull: ["$levelDetails.nameAr", null],
                },
              },
            },
            {
              key: "Origin",
              value: {
                $ifNull: ["$origin", null],
              },
            },
          ],
          postTypeObj: "$postTypeObj",
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
              modeShow: {
                $ifNull: ["$models.modelHide", ""],
              },
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
              modeShow: {
                $ifNull: ["$models.modelHide", ""],
              },
            },
          },
          filterItem: [
            {
              key: "Door",
              value: {
                $ifNull: ["$doorCountObject.nameEn", null],
              },
              id: {
                $ifNull: ["$door_count_id", null],
              },
            },
            {
              key: "Year",
              value: {
                $ifNull: ["$year.nameEn", null],
              },
              id: {
                $ifNull: ["$year._id", null],
              },
            },
            {
              key: "Make",
              value: {
                $ifNull: ["$make.name.en", null],
              },
              id: {
                $ifNull: ["$make_id", null],
              },
            },
            {
              key: "Models",
              value: {
                $ifNull: ["$modelsList.name.en", null],
              },
              id: {
                $ifNull: ["$modelsList._id", null],
              },
            },
            {
              key: "Trim",
              value: {
                $ifNull: ["$trimObject.name.en", null],
              },
              id: {
                $ifNull: ["$trimObject._id", null],
              },
            },
            {
              key: "Body",
              value: {
                $ifNull: ["$body.nameEn", null],
              },
              id: {
                $ifNull: ["$body_id", null],
              },
            },
            {
              key: "Condition",
              value: {
                $ifNull: ["$condition.nameEn", null],
              },
              id: {
                $ifNull: ["$condition._id", null],
              },
            },
            {
              key: "Exterior Color",
              value: {
                $ifNull: ["$exteriorColor.nameEn", null],
              },
              id: {
                $ifNull: ["$exteriorColor._id", null],
              },
            },
            {
              key: "Engine Size",
              value: {
                $ifNull: ["$engineSizeObject.nameEn", null],
              },
              id: {
                $ifNull: ["$engineSizeObject._id", null],
              },
            },
            {
              key: "Cylinder Count",
              value: {
                $ifNull: ["$cylinderCount.nameEn", null],
              },
              id: {
                $ifNull: ["$cylinderCount._id", null],
              },
            },
            {
              key: "Fuel",
              value: {
                $ifNull: ["$fuelType.nameEn", null],
              },
              id: {
                $ifNull: ["$fuelType._id", null],
              },
            },
            {
              key: "Transmission",
              value: {
                $ifNull: ["$transmissionType.nameEn", null],
              },
              id: {
                $ifNull: ["$transmissionType._id", null],
              },
            },
            {
              key: "Drivetrain",
              value: {
                $ifNull: ["$driveTrain.nameEn", null],
              },
              id: {
                $ifNull: ["$driveTrain._id", null],
              },
            },
            {
              key: "Interior Color",
              value: {
                $ifNull: ["$interiorColor.nameEn", null],
              },
              id: {
                $ifNull: ["$interiorColor._id", null],
              },
            },
            {
              key: "Seats",
              value: {
                $ifNull: ["$seatsType.nameEn", null],
              },
              id: {
                $ifNull: ["$seatsType._id", null],
              },
            },
            {
              key: "Origin",
              value: {
                $ifNull: ["$origin.nameEn", null],
              },
              id: {
                $ifNull: ["$origin._id", null],
              },
            },
            {
              key: "Governorate",
              value: {
                $ifNull: ["$governorate.nameEn", null],
              },
              id: {
                $ifNull: ["$governorate._id", null],
              },
            },
            {
              key: "State",
              value: {
                $ifNull: ["$state.nameEn", null],
              },
              id: {
                $ifNull: ["$state._id", null],
              },
            },
            {
              key: "Warranty Kilometer",
              value: {
                $ifNull: ["$warranty_kilometer", null],
              },
              id: {
                $ifNull: ["$warranty_kilometer", null],
              },
            },
            {
              key: "Warranty Duration",
              value: {
                $ifNull: ["$warrantyDuration.nameEn", null],
              },
              id: {
                $ifNull: ["$warrantyDuration._id", null],
              },
            },
            {
              key: "Insurance",
              value: {
                $ifNull: ["$insuranceType.nameEn", null],
              },
              id: {
                $ifNull: ["$insuranceType._id", null],
              },
            },
            {
              key: "Plate Type",
              value: {
                $ifNull: ["$plateType.nameEn", null],
              },
              id: {
                $ifNull: ["$plateType._id", null],
              },
            },
            {
              key: "Driving Readiness",
              value: {
                $ifNull: ["$readiness.nameEn", null],
              },
              id: {
                $ifNull: ["$readiness._id", null],
              },
            },
            {
              key: "Sale Type",
              value: {
                $ifNull: ["$saleType.nameEn", null],
              },
              id: {
                $ifNull: ["$saleType._id", null],
              },
            },
            {
              key: "Distance Travelled",
              value: {
                $ifNull: ["$distance_kilometer", null],
              },
              id: {
                $ifNull: ["$distance_kilometer", null],
              },
            },
          ],
          post_status: {
            $ifNull: ["$post_status", null],
          },
          price: {
            $ifNull: ["$price", null],
          },
          featuersList: {
            $ifNull: ["$featuersList", null],
          },
          levelDetails: {
            nameEn: {
              $ifNull: ["$levelDetails.nameEn", null],
            },
            nameAr: {
              $ifNull: ["$levelDetails.nameAr", null],
            },
            id: {
              $ifNull: ["$levelDetails._id", null],
            },
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
              $ifNull: ["$user.userpublicId", null],
            },
            phoneBusiness: {
              $ifNull: ["$user.phoneBusiness", null],
            },
            secondaryPhone: {
              $ifNull: ["$user.secondaryPhone", null],
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
            $ifNull: ["$post_type", null],
          },
          year: {
            $toInt: {
              $ifNull: ["$year.nameEn", null],
            },
          },
          distancekilometer: {
            $ifNull: ["$distance_kilometer", null],
          },
          user_governate: "$user.businessGovernorate",
          user_state: "$user.businessState",
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
module.exports.getDashboardViews = getDashboardViews;
