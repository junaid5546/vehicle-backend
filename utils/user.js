const router = require("express").Router();
const userSchema = require("../../../model/users/authentication/user.model.js");
const verify = require("../../../middlewares/verifyToken.middleware.js");
const userView = require("../../../views/user.view.js");
const userpublicProfile = require("../../../views/userPublicProfile.view.js");
const userPrivateProfile = require("../../../views/userPrivateProfile.view.js");
const vfs_schema = require("../../../model/vehicle_for_sale/oman/posts/vehicleForSalePost.model");
const moment = require("moment");

router.get("/user/favourites", verify, async (req, res) => {
  try {
    const favouritePosts = await userSchema
      .findById({
        _id: "62f1114f0ddd5830c081237c",
      })
      .select("favourite");

    if (!favouritePosts)
      return res.status(404).send({
        code: 404,
        message: "user is not exits",
        result: null,
      });

    return res.json({
      code: 200,
      message: "record founded",
      result: favouritePosts,
    });
  } catch (error) {
    return res.status(400).json({
      code: 400,
      message: error.message,
      result: [],
    });
  }
});

router.get("/user", async (req, res) => {
  try {
    let phone = {
      countryCode: req.query["area-code"],
      phoneNumber: req.query["phone-number"],
    };
    const user = await userSchema.findOne({
      $or: [
        {
          primaryPhone: {
            countryCode: phone.countryCode?.toString(),
            phoneNumber: phone.phoneNumber?.toString(),
          },
        },
        {
          phoneBusiness: {
            countryCode: phone.countryCode?.toString(),
            phoneNumber: phone.phoneNumber?.toString(),
          },
        },
      ],
    });

    if (!user)
      return res.status(200).send({
        code: 3,
        message: "user is not Exits",
        result: null,
      });

    res.json({
      code: 200,
      message: "record found",
      result: user,
    });
  } catch (error) {
    res.status(400).json({ code: 400, message: error.message, result: [] });
  }
});

router.get("/user-2", async (req, res) => {
  try {
    let phone = {
      countryCode: req.query["area-code"],
      phoneNumber: req.query["phone-number"],
    };
    const dob = req.query?.dob ?? "no dob";

    const user = await userSchema.findOne({
      $or: [
        {
          primaryPhone: {
            countryCode: phone.countryCode?.toString(),
            phoneNumber: phone.phoneNumber?.toString(),
          },
        },
        {
          phoneBusiness: {
            countryCode: phone.countryCode?.toString(),
            phoneNumber: phone.phoneNumber?.toString(),
          },
        },
      ],
    });
    const dobExist = await userSchema.findOne({ dob: dob });
    if (!user)
      return res.status(200).send({
        code: 3,
        message: "phone does not Exits",
        result: false,
      });

    if (!dobExist) {
      return res.status(200).send({
        code: 3,
        message: "Date of birth not Exits",
        result: false,
      });
    }

    res.json({
      code: 200,
      message: "record found",
      result: true,
    });
  } catch (error) {
    res.status(400).json({ code: 400, message: error.message, result: [] });
  }
});

// GET USER PUBLIC PROFILE
router.get("/user/public-profile/:_id", async (req, res) => {
  if (!req.params._id) {
    return res.status(400).json({
      code: 400,
      message: "something went wrong",
      result: [],
    });
  }

  try {
    const user = await userpublicProfile.findById({ _id: req.params._id });
    // const user = await userSchema.findById({ _id: req.params._id });

    if (!user)
      return res.status(404).send({
        code: 404,
        message: "user is not exits",
        result: null,
      });

    res.json({
      code: 200,
      message: "record found",
      result: user,
    });
  } catch (error) {
    res.status(400).json({ code: 200, message: error.message, result: [] });
  }
});

// GET USER PRIVATE PROFILE
router.get("/user/public-private/:_id", async (req, res) => {
  if (!req.params._id) {
    return res.status(400).json({
      code: 400,
      message: "something went wrong",
      result: [],
    });
  }

  try {
    const user = await userPrivateProfile.findById({ _id: req.params._id });
    // const user = await userSchema.findById({ _id: req.params._id });

    if (!user)
      return res.status(200).send({
        code: 200,
        message: "user is not exits",
        result: null,
      });

    res.json({
      code: 200,
      message: "record found",
      result: user,
    });
  } catch (error) {
    res.status(400).json({ code: 400, message: error.message, result: [] });
  }
});

// GET USER BY ID
router.get("/user/:_id", async (req, res) => {
  if (!req.params._id) {
    return res.status(400).json({
      code: 400,
      message: "something went wrong",
      result: [],
    });
  }

  try {
    const user = await userView.findById({ _id: req.params._id });
    // const user = await userSchema.findById({ _id: req.params._id });

    if (!user)
      return res.status(200).send({
        code: 400,
        message: "user is not exits",
        result: null,
      });

    res.json({
      code: 200,
      message: "record found",
      result: user,
    });
  } catch (error) {
    res.status(400).json({ code: 200, message: error.message, result: [] });
  }
});

// UPDATE USER BY ID
router.put("/user/:_id", async (req, res) => {
  const body = req.body;
  if (!req.params._id) {
    return res.status(400).json({
      code: 400,
      message: "something went wrong",
      result: [],
    });
  }

  if (req?.body?.primaryPhone?.phoneNumber) {
    req.body.primaryPhone.phoneNumber =
      req?.body?.primaryPhone?.phoneNumber.substring(4);
  }
  if (req?.body?.phoneBusiness?.phoneNumber) {
    req.body.phoneBusiness.phoneNumber =
      req?.body?.phoneBusiness?.phoneNumber.substring(3);
  }

  try {
    const user = await userSchema.findByIdAndUpdate(
      { _id: req.params._id },
      body,
      {
        new: true,
      }
    );

    if (!user)
      return res.status(404).send({
        code: 404,
        message: "user is not exits",
        result: null,
      });

    return res.json({
      code: 200,
      message: "post Updated successfully",
      result: user,
    });
  } catch (error) {
    return res.status(400).json({
      code: 400,
      // message: error.name === 'cast',//\
      message:
        error.name === "CastError"
          ? `${error?.path} must be a ${error?.kind}`
          : error?.message,

      result: [],
    });
  }
});

// ADD POST TO FAVORITES
router.post("/user/add-to-favourite", async (req, res) => {
  try {
    const addToFavorite = await userSchema.findByIdAndUpdate(
      { _id: req.body.user_id },
      {
        $push: { favourite: req.body.post_id },
      }
    );

    if (!addToFavorite)
      return res.status(404).send({
        code: 404,
        message: "user is not exits",
        result: null,
      });

    return res.json({
      code: 200,
      message: "post added successfully",
      result: [],
    });
  } catch (error) {
    return res.status(400).json({
      code: 400,
      message: error.message,
      result: [],
    });
  }
});

// GET USERS
router.get("/users", async (req, res) => {
  try {
    const options = {
      page: parseInt(req?.query["page-number"] ?? 0),
      limit: parseInt(req?.query["page-size"] ?? 10),
      sort: { createdAt: -1 },
    };

    let user = {};
    if (req.query.phone) {
      user = await userSchema.paginate(
        {
          $or: [
            { "phoneBusiness.countryCode": { $regex: "^" + req.query.phone } },
            { "phoneBusiness.phoneNumber": { $regex: "^" + req.query.phone } },
            { "primaryPhone.countryCode": { $regex: "^" + req.query.phone } },
            { "primaryPhone.phoneNumber": { $regex: "^" + req.query.phone } },
          ],
        },
        options
      );
    } else if (req.query.name) {
      user = await userSchema.paginate(
        {
          $or: [
            { firstName: { $regex: req.query.name } },
            { lastName: { $regex: req.query.name } },
          ],
        },
        options
      );
    } else {
      user = await userSchema.paginate({}, options);
    }

    if (!user)
      return res.status(200).send({
        code: 400,
        message: "users not found",
        result: [],
      });
    const userData = await Promise.all(
      user.docs.map(async (e) => {
        const dateOfBirth = moment(parseInt(e["dob"])).format("DD-MMM-YYYY");
        e["dob"] = dateOfBirth;
        e["vfs_count"] = await vfs_schema.find({ user_id: e._id }).count();
        e.primaryPhone.phoneNumber = `${e.primaryPhone?.countryCode} ${e.primaryPhone?.phoneNumber}`;
        e.phoneBusiness.phoneNumber = `${e.phoneBusiness?.countryCode} ${e.phoneBusiness?.phoneNumber}`;
        return e;
      })
    );
    res.json({
      code: 200,
      message: userData.length + "  record found",
      result: userData,
    });
  } catch (error) {
    res.status(400).json({ code: 200, message: error.message, result: [] });
  }
});

module.exports = router;
