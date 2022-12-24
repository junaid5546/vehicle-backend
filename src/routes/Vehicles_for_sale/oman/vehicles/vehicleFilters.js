const router = require("express").Router();
const FiltersSchema = require("../../../../model/vehicle_for_sale/oman/vehicles/vehicleFilters.model");
const vehicleBodies = require("../../../../model/vehicle_for_sale/oman/vehicles/vehicleBodies.model.js");
const governorateSchema = require("../../../../model/locatons/oman/locations.model.js");
// const masterVehicle = require("../../../../model/vehicle_for_sale/oman/vehicles/vehicle_options.js");
const makesSchema = require("../../../../model/vehicle_for_sale/oman/vehicles/makes");
const xlsx = require("xlsx-to-json");
const { langHandler } = require("../../../../../utils/languageHandler.js");
const { path_secquence } = require("../../../../../utils/vechicalFeatures.js");
const featuresModel = require("../../../../model/vehicle_for_sale/oman/vehicles/features.model.js");
const { fileCsv } = require("../../../../../utils/multer.js");
const { default: mongoose } = require("mongoose");

// GET ALL LIST OF FILTERS
router.get("/vehicle-for-sale/filters", async (req, res) => {
  let lang = req.header("lang");
  const type = req.query.type;
  //GET ALL FILTER FOR VEHICLES

  const filters = await FiltersSchema.find().sort({ addVehicleOrder: 1 });
  const filterSecquence = filters?.map((e) => {
    const path = path_secquence(e?.nameEn);
    const data = path === "year" ? e?.types?.reverse() : e?.types;
    return {
      _id: e?._id,
      name: {
        en: e?.nameEn,
        ar: e?.nameAr,
      },
      path: path,
      addVehicleOrder: e?.addVehicleOrder,
      filterOrder: e?.filterOrder,
      types: data?.map((type) => {
        const dataObj =
          path === "exterior_color" || path === "interior_color"
            ? {
                _id: type?._id,
                name: {
                  en: type?.nameEn,
                  ar: type?.nameAr,
                },

                cssHex: type?.cssHex ?? "#0000",
                minTravelledDistance: type?.minTravelledDistance,
              }
            : path === "year"
            ? {
                _id: type?._id,
                name: {
                  en: type?.nameEn,
                  ar: type?.nameAr,
                },
                minTravelledDistance: type?.minTravelledDistance,
                error: {
                  en: type?.errorEn ? type?.errorEn : "Someting went wrong ",
                  ar: type?.errorAr ? type?.errorAr : "Someting went wrong ",
                },
              }
            : {
                _id: type?._id,
                name: {
                  en: type?.nameEn,
                  ar: type?.nameAr,
                },
              };

        if (1 == 1) {
          return dataObj;
        } else {
          return dataObj;
        }
      }),
    };
  });

  res.json({
    code: 200,
    message: "records found",
    filters: filterSecquence,
  });
});
// GET ALL LIST OF FILTERS
router.get("/vehicle-for-sale/locations", async (req, res) => {
  let lang = req.header("lang");
  const type = req.query.type;
  //GET ALL GOVERNORATES
  const govList = await governorateSchema.find();
  const governorateList = govList?.map((e) => {
    return {
      _id: e._id,
      name: {
        en: e?.nameEn,
        ar: e?.nameAr,
      },
      states: e?.states?.map((state) => {
        return {
          _id: state._id,
          name: {
            en: state?.nameEn,
            ar: state?.nameAr,
          },
          doorCount: state?.doorCount,
        };
      }),
    };
  });
  res.json({
    code: 200,
    message: "records found",
    locations: governorateList,
  });
});
// GET ALL LIST OF FILTERS
router.get("/vehicle-for-sale/features", async (req, res) => {
  let lang = req.header("lang");
  const type = req.query.type;

  //GET Features for Vehicles
  const saveFeature = await featuresModel.find();
  const features_list = saveFeature?.map((e) => {
    return {
      _id: e._id,
      name: {
        en: e?.featureEn,
        ar: e?.featureAr,
      },
    };
  });

  res.json({
    code: 200,
    message: "records found",
    features: features_list,
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
//Updates Post data
router.patch("/add-models", fileCsv, async (req, res) => {
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
router.get("/get-door-counts", async (req, res) => {
  try {
    const doorCounts = await FiltersSchema.findOne({ nameEn: "Doors" });
    const structureDoorCounts = doorCounts.types.map((e) => {
      return {
        id: e._id,
        index_id: e.index_id,
        name: {
          en: e.nameEn,
          ar: e.nameAr,
        },
      };
    });
    res.send(structureDoorCounts);
  } catch (error) {
    res.status(400).json({ code: 400, message: error.message, result: [] });
  }
});
router.get("/get-engine-sizes", async (req, res) => {
  try {
    const engine_sizes = await FiltersSchema.findOne({ nameEn: "Engine Size" });
    const structureEngine_sizes = engine_sizes.types.map((e) => {
      return {
        id: e._id,
        index_id: e.index_id,
        name: {
          en: e.nameEn,
          ar: e.nameAr,
        },
      };
    });
    res.send(structureEngine_sizes);
  } catch (error) {
    res.status(400).json({ code: 400, message: error.message, result: [] });
  }
});
router.get("/get-bodies", async (req, res) => {
  try {
    const bodies = await vehicleBodies.find();
    const structureBodies = bodies.map((e) => {
      return {
        id: e._id,
        index_id: e.index_id,
        name: {
          en: e.nameEn,
          ar: e.nameAr,
        },
        error: {
          en: e.errorEn,
          ar: e.errorAr,
        },
        minPrice: e.minPrice,
        maxPrice: e.maxPrice,
        filtersId: e.filtersId,
        doorCount: e.doorCount,
        image: e.image,
      };
    });
    res.send(structureBodies);
  } catch (error) {
    res.status(400).json({ code: 400, message: error.message, result: [] });
  }
});

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

  const makes = await makesSchema.aggregate([
    {
      $lookup: {
        from: "vehicles_models",
        localField: "_id",
        foreignField: "make_id",
        as: "models",
      },
    },
    {
      $unwind: {
        path: "$models",
      },
    },
    {
      $lookup: {
        from: "vehicles_trims",
        localField: "models._id",
        foreignField: "model_id",
        as: "models.trims",
      },
    },
    {
      $group: {
        _id: "$_id",
        index_id: {
          $first: "$index_id",
        },
        name: {
          $first: "$name",
        },
        image: {
          $first: "$image",
        },
        models: {
          $push: "$models",
        },
      },
    },
    {
      $sort: {
        index_id: 1,
      },
    },
  ]);

  doorObject = getFilters(filterSecquence, "633194accdb2cd343d92d57d");
  engineSizeObject = getFilters(filterSecquence, "63352f11be893055dbcad5f5");

  const makeSecquence = await Promise.all(
    makes?.map(async (e) => {
      return {
        _id: e?._id,
        name: e?.name,
        index_id: e?.index_id,
        image: e?.image,
        models: await Promise.all(
          e?.models.map(async (model) => {
            return {
              _id: model?._id,
              name: model?.name,
              trims: await Promise.all(
                model?.trims?.map(async (trim) => {
                  return {
                    _id: trim?._id,
                    name: trim?.name,
                    bodies:
                      trim?.bodyID?.length > 0
                        ? await Promise.all(
                            trim?.bodyID?.map(async (body) => {
                              let bodyg = await vehicleBodies.find({
                                _id: body?._id,
                              });
                              return {
                                _id: bodyg[0]?._id,
                                name: {
                                  en: bodyg[0]?.nameEn,
                                  ar: bodyg[0]?.nameAr,
                                },
                                image: bodyg[0]?.image,
                                minPrice: bodyg[0]?.minPrice,
                                maxPrice: bodyg[0]?.maxPrice,
                                error: {
                                  en: bodyg[0]?.errorEn,
                                  ar: bodyg[0]?.errorAr,
                                },
                                filtersId: bodyg[0]?.filtersId,
                                doorCount:
                                  bodyg[0]?.doorCount?.length > 0
                                    ? await Promise.all(
                                        bodyg[0]?.doorCount?.map(async (id) => {
                                          let d = doorObject[0]?.filter(
                                            (m) => m?._id == id
                                          );

                                          return {
                                            name: {
                                              en: d[0]?.name,
                                              ar: d[0]?.name,
                                            },
                                            _id: d[0]?._id,
                                          };
                                        })
                                      )
                                    : [],
                              };
                            })
                          )
                        : [],
                    engineSize:
                      trim?.engineSize?.length > 0
                        ? await Promise.all(
                            trim?.engineSize?.map(async (id) => {
                              let d = engineSizeObject[0].filter((m) =>
                                m?._id.equals(id)
                              );
                              return {
                                name: {
                                  en: d[0]?.name,
                                  ar: d[0]?.name,
                                },
                                _id: d[0]?._id,
                              };
                            })
                          )
                        : [],
                  };
                })
              ),
            };
          })
        ),
      };
    })
  );

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

getbodis = async (bodyID) => {
  await vehicleBodies
    .find({
      _id: { $in: bodyID },
    })
    .then((m) => {
      return m;
    });
};

getFilters = (filterSecquence, id) => {
  return filterSecquence
    .filter(function (obj) {
      return obj._id == id;
    })
    .map(function (obj) {
      return obj.types;
    });
};

module.exports = router;
