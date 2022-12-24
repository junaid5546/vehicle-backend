const router = require("express").Router();
const { v4: uuidv4 } = require("uuid");
const verify = require("../../../../middlewares/verifyToken.middleware.js");
const FiltersSchema = require("../../../../model/vehicle_for_sale/oman/vehicles/vehicleFilters.model");
const vehicleBodies = require("../../../../model/vehicle_for_sale/oman/vehicles/vehicleBodies.model.js");
const governorateSchema = require("../../../../model/locatons/oman/locations.model.js");
const masterVehicle = require("../../../../model/vehicle_for_sale/oman/vehicles/vehicle_options.js");
const xlsx = require("xlsx-to-json");

const {
  addVehicleFilterValidation,
  addVehicleFilterTypeValidation,
  updateVehicleFilterValidation,
  upadteVehicleFilterTypeValidation,
} = require("../../../../validation");
const { langHandler } = require("../../../../../utils/languageHandler.js");
const { path_secquence } = require("../../../../../utils/vechicalFeatures.js");
const featuresModel = require("../../../../model/vehicle_for_sale/oman/vehicles/features.model.js");
const { csvUploder } = require("../../../../../csvToJson.js");

// GET ALL LIST OF FILTERS
router.get("/vehicle-for-sale/post-feed", async (req, res) => {
  let lang = req.header("lang");

  //GET ALL FILTER FOR VEHICLES
  const filters = await FiltersSchema.find();
  const filterSecquence = filters?.map((e) => {
    const path = path_secquence(e?.nameEn);
    return {
      _id: e?._id,
      name: langHandler(e?.nameAr, e?.nameEn, lang),
      path: path,
      addVehicleOrder: e?.addVehicleOrder,
      filterOrder: e?.filterOrder,
      types: e?.types?.map((type) => {
        return {
          _id: type?._id,
          name: langHandler(type?.nameAr, type?.nameEn, lang),
          cssHex: type?.cssHex,
          error: langHandler(e?.errorAr, e?.errorEn, lang),
          minTravelledDistance: type?.minTravelledDistance,
        };
      }),
    };
  });

  //GET ALL GOVERNORATES
  const govList = await governorateSchema.find();
  const governorateList = govList?.map((e) => {
    return {
      _id: e._id,
      name: langHandler(e?.nameAr, e?.nameEn, lang),
      states: e?.states?.map((state) => {
        return {
          _id: state._id,
          name: langHandler(state?.nameAr, state?.nameEn, lang),
          doorCount: state?.doorCount,
        };
      }),
    };
  });

  //GET Features for Vehicles
  const saveFeature = await featuresModel.find();
  const features_list = saveFeature?.map((e) => {
    return {
      _id: e._id,
      name: langHandler(e.featureAr, e.featureEn, lang),
    };
  });

  //GET ALL MAKES -> MODEL -> TRIM -> BODY

  const makes = await masterVehicle.find();
  const makeSecquence = makes.map((e) => {
    return {
      _id: e._id,
      name: langHandler(e.nameAr, e.nameEn, lang),
      images: e?.image,
      models: e.models.map((model) => {
        return {
          _id: model._id,
          name: model.nameEn
            ? langHandler(model.nameAr, model.nameEn, lang)
            : "No Model",
          trims: model.trims.map((trim) => {
            return {
              _id: trim._id,
              name: trim.nameEn
                ? langHandler(trim.nameAr, trim.nameEn, lang)
                : "No Trim",
              bodies: trim?.bodyID?.map((body) => {
                return {
                  name: langHandler(body.nameAr, body.nameEn, lang),
                  image: body.image,
                  minPrice: body.minPrice,
                  maxPrice: body.maxPrice,
                  error: langHandler(body.errorAr, body.errorEn, lang),
                  filtersId: body?.filtersId,
                  _id: body?._id,
                  doorCount: body.doorCount?.map((e) => {
                    return {
                      name: e.name,
                      _id: e._id,
                    };
                  }),
                };
              }),
              engineSize: trim.engineSize?.map((e, index) => {
                return {
                  name: e,
                  _id: `${trim._id}-${index}`,
                };
              }),
            };
          }),
        };
      }),
    };
  });

  // const makeSecquence = makes.map(async (e) => {
  //   return {
  //     _id: e._id,
  //     name: langHandler(e.nameAr, e.nameEn, lang),
  //     images: e?.image,
  //     models: await Promise.all(
  //       e.models.map(async (model) => {
  //         return {
  //           count: await VFSPostSchema.find({ model_id: model._id })
  //             .select("_id")
  //             .count(),
  //           _id: model._id,
  //           name: model.nameEn
  //             ? langHandler(model.nameAr, model.nameEn, lang)
  //             : "No Model",
  //           trims: await Promise.all(
  //             model.trims.map(async (trim) => {
  //               return {
  //                 _id: trim._id,
  //                 count: await VFSPostSchema.find({
  //                   trim_id: trim._id,
  //                 })
  //                   .select("_id")
  //                   .count(),
  //                 name: trim.nameEn
  //                   ? langHandler(trim.nameAr, trim.nameEn, lang)
  //                   : "No Trim",
  //                 bodies:
  //                   trim?.bodyID?.length > 0
  //                     ? await Promise.all(
  //                         trim?.bodyID?.map(async (body) => {
  //                           return {
  //                             count: await VFSPostSchema.find({
  //                               body_id: body?._id,
  //                             })
  //                               .select("_id")
  //                               .count(),

  //                             name: langHandler(body.nameAr, body.nameEn, lang),
  //                             image: body.image,
  //                             minPrice: body.minPrice,
  //                             maxPrice: body.maxPrice,
  //                             error: langHandler(
  //                               body.errorAr,
  //                               body.errorEn,
  //                               lang
  //                             ),
  //                             filtersId: body?.filtersId,
  //                             _id: body?._id,
  //                             doorCount: body.doorCount?.map((e) => {
  //                               return {
  //                                 name: e.name,
  //                                 _id: e._id,
  //                               };
  //                             }),
  //                           };
  //                         })
  //                       )
  //                     : [],

  //                 engineSize: trim.engineSize?.map((e, index) => {
  //                   return {
  //                     name: e,
  //                     _id: `${trim._id}-${index}`,
  //                   };
  //                 }),
  //               };
  //             })
  //           ),
  //         };
  //       })
  //     ),
  //   };
  // });

  res.json({
    code: 200,
    message: "records found",
    result: {
      makes: makeSecquence,
      filters: filterSecquence,
      governorates: governorateList,
      features: features_list,
    },
  });
});

// GET ALL LIST OF FILTERS
router.get("/vehicle/filters", async (req, res) => {
  let lang = req.header("lang");
  let arr = [];

  //GET ALL FILTER FOR VEHICLES
  const filters = await FiltersSchema.find();
  const COUNT = await FiltersSchema.find().count();

  const filterSecquence = filters?.map((e) => {
    const path = path_secquence(e?.nameEn);
    arr.push(path);
    return {
      _id: e?._id,
      name: langHandler(e?.nameAr, e?.nameEn, lang),
      path: path,
      addVehicleOrder: e?.addVehicleOrder,
      filterOrder: e?.filterOrder,
      types: e?.types?.map((type) => {
        return {
          _id: type?._id,
          name: langHandler(type?.nameAr, type?.nameEn, lang),
          cssHex: type?.cssHex,
        };
      }),
    };
  });

  res.json({
    code: 200,
    COUNT,
    message: "records found",
    result: filterSecquence,
  });
});

// GET FILTER BY BODY ID
router.get("/vehicle/filters/:_bodyId", async (req, res) => {
  try {
    let lang = req.header("lang");
    const query = {
      page_number: req?.query?.page_number ?? 1,
      page_size: req?.query?.page_size ?? 10,
    };
    const options = {
      page: parseInt(req?.query["page-number"] ?? 0),
      limit: parseInt(req?.query["page-size"] ?? 10),
      sort: { addVehicleOrder: 1 },
    };

    const filterIds = await vehicleBodies.find({ _id: req.params._bodyId });

    const filters = await FiltersSchema.paginate(
      { _id: { $in: filterIds[0].filtersId } },
      options
    );
    if (!filters)
      return res.status(400).json({
        code: 400,
        message: "no records found",
        result: [],
      });

    if (filters) {
      const filterSecquence = filters?.docs?.map((e) => {
        return {
          _id: e?._id,
          name: langHandler(e?.nameAr, e?.nameEn, lang),
          addVehicleOrder: e?.addVehicleOrder,
          filterOrder: e?.filterOrder,
          types: e?.types?.map((type) => {
            return {
              _id: type?._id,
              name: langHandler(type?.nameAr, type?.nameEn, lang),
            };
          }),
        };
      });
      res.json({
        code: 200,
        message: filterSecquence.length + "records found",
        result: filterSecquence,
      });
    }
  } catch (error) {
    res.status(400).json({ code: 400, message: error.message, result: [] });
  }
});

// ADD NEW FILTER
router.post(
  "/vehicle/filters/add-filter",
  verify("public"),
  async (req, res) => {
    const { error } = await addVehicleFilterValidation(req.body);
    if (error)
      return res.status(400).json({
        code: 3,
        message: error.details[0].message,
        result: [],
      });

    const newfilter = new FiltersSchema({
      nameEn: req.body.filter_name_en,
      nameAr: req.body.filter_name_ar,
      types: [],
    });

    try {
      const filter = await newfilter.save();

      res.json({
        code: 200,
        message: "new filter added successfully",
        result: [],
      });
    } catch (error) {
      res.status(400).json({
        code: 400,
        message: error.message,
        result: [],
      });
    }
  }
);

// ADD NEW TYPE IN SELECTED FILTER
router.post("/vehicle/filters/add-type", verify("public"), async (req, res) => {
  // VALIDATE THE REQUSTED DATA
  const { error } = await addVehicleFilterTypeValidation(req.body);
  if (error)
    return res.status(400).json({
      code: 400,
      message: error.details[0].message,
      result: [],
    });

  // CHECK IF THE FILTER IS EXITE
  const findFilter = await FiltersSchema.findById({ _id: req.body._id });
  if (!findFilter)
    return res.status(200).json({
      code: 400,
      message: "selected filter not exite",
      result: [],
    });

  try {
    // ADD NEW FILTER'S TYPE

    const newType = await FiltersSchema.findByIdAndUpdate(
      { _id: req.body._id },
      {
        $addToSet: {
          types: {
            _id: uuidv4(), // findFilter.types.length + 1,
            nameEn: req.body.type_name_en,
            nameAr: req.body.type_name_ar,
          },
        },
      }
    );

    if (!newType)
      return res.status(200).send({
        code: 404,
        message: "record not found",
        result: null,
      });

    return res.json({
      code: 200,
      message: "new type added successfully",
      result: [],
    });
  } catch (error) {
    return res.status(400).json({
      code: 400,
      message: " something went wrong",
      result: [],
    });
  }
});

// UPDATE FILTER
router.put(
  "/vehicle/filters/update-filter",
  verify("public"),
  async (req, res) => {
    const { error } = await updateVehicleFilterValidation(req.body);
    if (error)
      return res.status(400).json({
        code: 400,
        message: error.details[0].message,
        result: [],
      });

    try {
      const filter = await FiltersSchema.findOneAndUpdate(
        { _id: req.body._id },
        {
          $set: {
            nameEn: req.body.filter_name_en,
            nameAr: req.body.filter_name_ar,
          },
        }
      );

      return res.json({
        code: 200,
        message: "filter Updated successfully",
        result: [],
      });
    } catch (error) {
      return res.status(400).json({
        code: 400,
        message: " something went wrong",
        result: [],
      });
    }
  }
);

// UPDATE FILTER'S TYPE
router.put(
  "/vehicle/filters/update-filter-type",
  verify("public"),
  async (req, res) => {
    const { error } = await upadteVehicleFilterTypeValidation(req.body);
    if (error)
      return res.status(400).json({
        code: 400,
        message: error.details[0].message,
        result: [],
      });

    const filter = await FiltersSchema.findById({ _id: req.body.filterId });

    if (filter) {
      try {
        const type = await filter.findOneAndUpdate(
          { _id: req.body._id },
          {
            $set: {
              nameEn: req.body.type_name_en,
              nameAr: req.body.type_name_ar,
            },
          }
        );
      } catch (error) {
        return res.status(400).json({
          code: 400,
          message: " something went wrong",
          result: [],
        });
      }
    }

    return res.status(400).json({
      code: 400,
      message: " something went wrong",
      result: [],
    });
  }
);

const filterData = (arr) => {
  const uniqueIds = [];
  const unique = arr.filter((element) => {
    const isDuplicateMake_en = uniqueIds.includes(element.make_en);
    if (!isDuplicateMake_en) {
      uniqueIds.push(element.id);
      return true;
    }
    return false;
  });
  return uniqueIds;
};

//Updates Post data
router.patch("/add-models", csvUploder, async (req, res) => {
  try {
    const csvFilePath = req.files[0].path;

    const modelIncludeCheck = (array, val) => {
      const isFound = array.some((element) => {
        if (element.nameEn === val) {
          return true;
        }
        return false;
      });
      return isFound;
    };
    xlsx(
      {
        input: csvFilePath,
        output: "output.json",
      },
      async function (err, result) {
        if (err) {
          console.error(err);
        } else {
          const comingData = await Promise.all(
            result.map(async (make) => {
              const makeExist = await masterVehicle.findOne({
                make_en: make?.make_en,
                make_ar: make?.make_ar,
              });

              // if (!modelIncludeCheck(makeExist.models, make?.model_en)) {
              //   // const updateMake = await masterVehicle.findOneAndUpdate(
              //   //   {
              //   //     _id: makeExist._id,
              //   //   },
              //   //   {
              //   //   },
              //   //   { new: true }
              //   // );
              // }

              // //if make not already exist
              // if(!makeExist){
              //   const newMake = new masterVehicle({
              //     make_en: make?.make_en,
              //     make_ar: make?.make_ar,
              //   });
              // }
            })
          );

          res.status(200).send({
            result,
          });
        }
      }
    );
  } catch (error) {
    res.status(400).json({ code: 400, message: error.message, result: [] });
  }
});

module.exports = router;
