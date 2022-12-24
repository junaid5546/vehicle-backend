const userSchema = require("../../../model/users/authentication/user.model.js");
const userView = require("../../../views/user.view.js");
const userpublicProfile = require("../../../views/userPublicProfile.view.js");
const userPrivateProfile = require("../../../views/userPrivateProfile.view.js");
const vfs_schema = require("../../../model/vehicle_for_sale/oman/posts/vehicleForSalePost.model");
const moment = require("moment");
const { userPrivateView } = require("../../../../utils/userPrivateView.js");
const ObjectId = require("mongoose").Types.ObjectId;

const getUserFavrouitePost = async (req, res) => {
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
};

const checkUserExistByPhone = async (req, res) => {
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
    //IF USER DOB AND USER PONE NOT FOUND
    if (!user) {
      return res.status(200).send({
        code: 1,
        result: false,
        action: "register",
      });
    }
    //IF USER PHONE EXIST AND USER DOB MATCH OR NULL UNDEFINED EMPTY STRING
    else if (user) {
      if (user.accountStatus === "deleted") {
        return res.status(200).send({
          code: 5,
          result: false,
          action: "Account deleted",
        });
      } else {
        return res.status(200).send({
          code: 200,
          result: true,
          action: "login",
        });
      }
    }
  } catch (error) {
    res.status(400).json({ code: 400, message: error.message, result: [] });
  }
};

const checkUserExistByPhoneAndDob = async (req, res) => {
  try {
    let phone = {
      countryCode: req.query["area-code"],
      phoneNumber: req.query["phone-number"],
    };
    const dob = req.query?.dob;
    if (!dob) {
      return res.status(200).send({
        code: 3,
        message: "please select dob",
        result: false,
      });
    }
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
    //IF USER DOB AND USER PONE NOT FOUND
    if (!user && !user?.dob) {
      return res.status(200).send({
        code: 1,
        result: false,
        action: "register",
      });
    }
    //IF USER PHONE EXIST AND USER DOB MATCH OR NULL UNDEFINED EMPTY STRING
    else if (
      user &&
      (user?.dob === dob ||
        user?.dob === "" ||
        user?.dob === null ||
        user?.dob === undefined)
    ) {
      return res.status(200).send({
        code: 200,
        result: true,
        action: "login",
      });
    }
    //IF USER PHONE EXIST AND USER DOB NOT MATCHED
    else if (user && user?.dob !== dob) {
      return res.status(200).send({
        code: 3,
        result: false,
        action: "reject",
      });
    }
  } catch (error) {
    res.status(400).json({ code: 400, message: error.message, result: [] });
  }
};

const getPublicProfile = async (req, res) => {
  if (!req.params._id) {
    return res.status(400).json({
      code: 400,
      message: "no user id found",
      result: [],
    });
  }
  try {
    const queryObj = {
      user_index: +req.params._id,
    };
    const user = await userPrivateView(queryObj);
    if (!user) {
      return res.status(400).json({
        code: 400,
        message: "no user found",
        result: [],
      });
    }
    const vfscountUser = await vfs_schema
      .findOne({
        user_id: user?._id,
        post_type: {
          $ne: null,
        },
      })
      .count();
    const userObj = {
      _id: user?._id,
      primaryPhone: `${
        user?.primaryPhone?.countryCode === null
          ? ""
          : user?.primaryPhone?.countryCode
      }${
        user?.primaryPhone?.phoneNumber === null
          ? ""
          : user?.primaryPhone?.phoneNumber
      }`,
      phoneBusiness: `${
        user?.phoneBusiness?.countryCode === null
          ? ""
          : user?.phoneBusiness?.countryCode
      } ${
        user?.phoneBusiness?.phoneNumber === null
          ? ""
          : user?.phoneBusiness?.phoneNumber
      }`,
      businessName: user?.businessName,
      dob: user?.dob,
      firstName: {
        en: user?.firstName,
        ar: user?.firstName,
      },
      lastName: {
        en: user?.lastName,
        ar: user?.lastName,
      },
      personalImage: user?.personalImage,
      businessImage: user?.businessImage,

      location: {
        en: `${user?.businessState?.nameEn}, ${user?.businessGovernorate?.nameEn}`,
        ar: `${user?.businessState?.nameAr}، ${user?.businessGovernorate?.nameAr}`,
      },
      post_counts: vfscountUser,
    };

    if (!user)
      return res.status(200).send({
        code: 200,
        message: "user is not exits",
        result: null,
      });

    res.json({
      code: 200,
      message: "record found",
      result: userObj,
    });
  } catch (error) {
    res.status(400).json({ code: 400, message: error.message, result: [] });
  }
};

const getPrivateProfile = async (req, res) => {
  if (!req.params._id) {
    return res.status(400).json({
      code: 400,
      message: "no user id found",
      result: [],
    });
  }

  try {
    const queryObj = {
      _id: ObjectId(req.params._id),
    };
    const user = await userPrivateView(queryObj);
    if (!user) {
      return res.status(400).json({
        code: 400,
        message: "no user found",
        result: [],
      });
    }
    const vfscountUser = await vfs_schema
      .findOne({
        user_id: user?._id,
        post_type: {
          $ne: null,
        },
      })
      .count();
    const userObj = {
      _id: user?._id,
      primaryPhone: `${
        user?.primaryPhone?.countryCode === null
          ? ""
          : user?.primaryPhone?.countryCode
      }${
        user?.primaryPhone?.phoneNumber === null
          ? ""
          : user?.primaryPhone?.phoneNumber
      }`,
      phoneBusiness: `${
        user?.phoneBusiness?.countryCode === null
          ? ""
          : user?.phoneBusiness?.countryCode
      } ${
        user?.phoneBusiness?.phoneNumber === null
          ? ""
          : user?.phoneBusiness?.phoneNumber
      }`,
      businessName: user?.businessName,
      dob: user?.dob,
      firstName: {
        en: user?.firstName,
        ar: user?.firstName,
      },
      lastName: {
        en: user?.lastName,
        ar: user?.lastName,
      },
      personalImage: user?.personalImage,
      businessImage: user?.businessImage,

      location: {
        en: `${user?.businessState?.nameEn}, ${user?.businessGovernorate?.nameEn}`,
        ar: `${user?.businessState?.nameAr}، ${user?.businessGovernorate?.nameAr}`,
      },
      post_counts: vfscountUser,
    };

    if (!user)
      return res.status(200).send({
        code: 200,
        message: "user is not exits",
        result: null,
      });

    res.json({
      code: 200,
      message: "record found",
      result: userObj,
    });
  } catch (error) {
    res.status(400).json({ code: 400, message: error.message, result: [] });
  }
};

const getUserById = async (req, res) => {
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
};

const updateUserById = async (req, res) => {
  const body = req.body;
  if (!req.params._id) {
    return res.status(400).json({
      code: 400,
      message: "something went wrong",
      result: [],
    });
  }

  if (req?.body?.primaryPhone?.phoneNumber) {
    req.body.primaryPhone.phoneNumber = req?.body?.primaryPhone?.phoneNumber;
  }
  if (req?.body?.phoneBusiness?.phoneNumber) {
    req.body.phoneBusiness.phoneNumber = req?.body?.phoneBusiness?.phoneNumber;
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
      message:
        error.name === "CastError"
          ? `${error?.path} must be a ${error?.kind}`
          : error?.message,

      result: [],
    });
  }
};

const addToFavorite = async (req, res) => {
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
};

const getAllUsersWithFilter = async (req, res) => {
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
      user = await userSchem.paginate({}, options);
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
};

//Delete Account / InActive Account
const deleteUser = async (req, res) => {
  try {
    const user_id = req.params?.user_id;
    await userSchema.findByIdAndUpdate(
      { _id: user_id },
      { accountStatus: "deleted" },
      { new: true }
    );
    res.send({
      code: 200,
      message: "Your account has been successfully deleted",
    });
  } catch (error) {
    res.status(400).json({ code: 400, message: error.message, result: [] });
  }
};

module.exports = {
  getUserFavrouitePost,
  checkUserExistByPhone,
  checkUserExistByPhoneAndDob,
  getPublicProfile,
  getPrivateProfile,
  getUserById,
  updateUserById,
  addToFavorite,
  getAllUsersWithFilter,
  deleteUser,
};
