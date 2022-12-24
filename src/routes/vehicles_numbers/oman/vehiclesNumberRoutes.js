const router = require("express").Router();
const vehiclesNumbersPostsSchema = require("../../../model/vehicles_numbers/om/vehicles_numbers_posts/vehiclesNumbersPosts.model.js");
const vehiclesNumbersLettersOm = require("../../../model/vehicles_numbers/om/vehicles_numbers_letters/vehiclesNumbersLettersOm.model.js");
const vehiclesNumbersOptionsOm = require("../../../model/vehicles_numbers/om/vehicles_numbers_posts/vehiclesNumbersPosts.model");
const vehiclesNumbersPostsOmView = require("../../../model/vehicles_numbers/om/vehicles_numbers_views/vehiclesNumbersPostsOm.view.js");
const governorateSchema = require("../../../model/locatons/oman/locations.model.js");
const getValueForNextSequence = require("../../../functions/postSequence.js");
const { langHandler } = require("../../../../utils/languageHandler.js");
const { addVehicleNumberPost } = require("../../../validation");
const {
  getVehiclesNumberSortType,
} = require("../../../functions/vehicleForSaleFunction.js");

router.post("/vehicles-number", async (req, res) => {
  try {
    const { error } = addVehicleNumberPost(req.body);
    if (error)
      return res.status(400).json({
        code: 3,
        message: error.details[0].message,
        result: [],
      });

    const numbercount = req.body.vehicleNumber.toString().length;

    const newPost = vehiclesNumbersPostsSchema({
      postId: await getValueForNextSequence("post_id"),
      userId: req.body.userId,
      vehicleNumber: req.body.vehicleNumber,
      vehicleLetterId: req.body.vehicleLetterId,
      plateTypeId: req.body.plateTypeId,
      transferTypeId: req.body.transferTypeId,
      governorateId: req.body.governorateId,
      stateId: req.body.stateId,
      post_status: req.body.postStatus,
      price: req.body.price,
      numberCount: numbercount,
    });

    const post = await newPost.save();
    res.json({
      code: 200,
      message: "new post added successfully",
      result: post,
    });
  } catch (error) {
    res.status(400).json({
      code: 400,
      message: error.message,
      result: [],
    });
  }
});

router.get("/vehicles-number/data", async (req, res) => {
  try {
    let lang = req.header("lang");

    const playteLetters = await vehiclesNumbersLettersOm.find();

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

    const vehiclesNumbersOption = await vehiclesNumbersOptionsOm.find();
    const vehiclesNumbersOptionList = vehiclesNumbersOption?.map((e) => {
      return {
        _id: e._id,
        name: langHandler(e?.nameAr, e?.nameEn, lang),
        types: e?.types?.map((type) => {
          return {
            _id: type._id,
            name: langHandler(type?.nameAr, type?.nameEn, lang),
            value: type.value,
          };
        }),
      };
    });

    res.json({
      code: 200,
      message: "",
      result: {
        playteLetters,
        governorateList,
        options: vehiclesNumbersOptionList,
      },
    });
  } catch (error) {
    res.status(400).json({
      code: 400,
      message: error.message,
      result: [],
    });
  }
});

router.post("/vehicles-number/filtered", async (req, res) => {
  try {
    let sortType = await getVehiclesNumberSortType(req?.query["sort-type"]);

    let lang = req.header("lang");
    const options = {
      page: parseInt(req?.query["page-number"] ?? 0),
      limit: parseInt(req?.query["page-size"] ?? 100),
      sort: sortType,
    };

    let query = [];
    let posts = {};

    if (req.body.plateType) {
      query.push({
        "plateType._id": { $in: req.body.plateType },
      });
    }
    if (req.body.governorate) {
      query.push({
        "governorate._id": { $in: req.body.governorate },
      });
    }
    if (req.body.vehicleLetter) {
      query.push({
        "vehicleLetter._id": { $in: req.body.vehicleLetter },
      });
    }
    if (req.body.state) {
      query.push({
        "state._id": { $in: req.body.state },
      });
    }
    if (req.body.transferType) {
      query.push({
        "transferType._id": { $in: req.body.transferType },
      });
    }
    if (req.body.plateNumber) {
      query.push({
        vehicleNumberAsString: { $regex: req.body.plateNumber.toString() },
      });
    }
    if (req.body.letterCount) {
      query.push({
        "vehicleLetter.value": { $in: req.body.letterCount },
      });
    }
    if (req.body.numberCount) {
      query.push({
        numberCount: { $in: req.body.numberCount },
      });
    }

    if (Object.keys(query).length === 0) {
      posts = await vehiclesNumbersPostsOmView.paginate({}, options);
    } else {
      posts = await vehiclesNumbersPostsOmView.paginate(
        { $and: query },
        options
      );
    }

    const recored = posts.docs?.map((e) => {
      return {
        _id: e?._id,
        createdAt: e?.createdAt,
        updatedAt: e?.updatedAt,
        user: e?.user,
        vehicleLetter: e?.vehicleLetter,
        governorate: {
          _id: e?.governorate._id,
          name: langHandler(
            e?.governorate?.nameAr,
            e?.governorate?.nameEn,
            lang
          ),
        },
        postId: e?.postId,
        vehicleNumber: e?.vehicleNumber,
        price: e?.price,
        numberCount: e?.numberCount,
        state: {
          _id: e?.state._id,
          name: langHandler(e?.state?.nameAr, e?.state?.nameEn, lang),
        },
        plateType: {
          _id: e?.plateType._id,
          name: langHandler(e?.plateType?.nameAr, e?.plateType?.nameEn, lang),
        },
        transferType: {
          _id: e?.transferType._id,
          name: langHandler(
            e?.transferType?.nameAr,
            e?.transferType?.nameEn,
            lang
          ),
        },
        postStatus: {
          _id: e?.postStatus._id,
          name: langHandler(
            e?.postStatus?.statusAr,
            e?.postStatus?.statusEn,
            lang
          ),
        },
      };
    });

    res.json({
      code: 200,
      message: posts.totalDocs + " recored found",
      result: recored,
    });
  } catch (error) {
    res.status(400).json({
      code: 400,
      message: error.message,
      result: [],
    });
  }
});

//COUNT VIEWS FOR ALL COUNTING CATEGORIES FOR POSTS
router.patch("/vehicles-number/counter/:id", async (req, res) => {
  const id = req.params.id;
  const Type = req.body.type;
  await viewsCounterVehiclesNumberPost(id, Type)
    .then(() => {
      res.status(200).send({
        code: 200,
        message: "Counted successfully",
      });
    })
    .catch((err) => {
      res.status(400).send({
        code: 400,
        message: err.message,
      });
    });
});

router.post("/vehicles-number/by-ids", async (req, res) => {
  try {
    const postIds = req.body["post-ids"];
    const options = {
      page: parseInt(req?.query["page-number"] ?? 0),
      limit: parseInt(req?.query["page-size"] ?? 100),
    };

    const posts = await vehiclesNumbersPostsOmView.paginate(
      { _id: { $in: postIds } },
      options
    );

    res.json({
      code: 200,
      message: posts.totalDocs + " recored found",
      result: posts.docs,
    });
  } catch (error) {
    res.status(400).json({
      code: 400,
      message: error.message,
      result: [],
    });
  }
});
module.exports = router;
