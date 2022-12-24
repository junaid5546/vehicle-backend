const jwt = require("jsonwebtoken");
const User = require("../../../model/users/authentication/user.model");
const Session = require("../../../model/users/authentication/session.model");
const user_subscriptions_record = require("../../../model/users/subscriptions/users_subscriptions_records_om.js");
const dotenv = require("dotenv");
const {
  registerValidation,
  loginValidation,
} = require("../../../validations/userValidation");
dotenv.config();
const TOKEN_SECRET = process.env.TOKEN_SECRET;
const { v4: uuidv4 } = require("uuid");

//Register User
const register = async (req, res) => {
  try {
    // VALIDATE THE USER DETAILES BEFORE REGISTER IT
    req.body.dob = req.body.dob?.toString();
    const { error } = registerValidation(req.body);
    if (error)
      return res
        .status(200)
        .json({ code: 200, message: error.details[0].message, result: [] });
    // CHECK IF THE USER IS ALREADY IN THE DATABASE
    const userExist = await User.findOne({
      primaryPhone: {
        countryCode: req.body?.primary_phone?.countryCode?.toString(),
        phoneNumber: req.body?.primary_phone?.phoneNumber?.toString(),
      },
    });
    if (userExist)
      return res
        .status(200)
        .json({ code: 3, message: "the user is already exist", result: [] });

    // CREATE NEW USER
    const user = new User({
      firstName: req.body.first_name,
      lastName: req.body.last_name,
      primaryPhone: {
        countryCode: req.body?.primary_phone?.countryCode?.toString(),
        phoneNumber: req.body?.primary_phone?.phoneNumber?.toString(),
      },
      dob: req.body.dob,
      accountType: !req.body.accountType ? "personal" : req.body.accountType,
    });

    const savedUser = await user.save();
    const subscription_id = uuidv4();
    const initialSub = new user_subscriptions_record({
      user_id: savedUser._id,
      user_subscriptons: {
        type: "Free",
        price: 0,
        Employee_index_id: "DM",
        subscription_id: subscription_id,
        post_types: [
          {
            post_type_id: "62e40a9be0ffd1f52de88309",
            count: 3,
          },
          {
            post_type_id: "62e40a9be0ffd1f52de88316",
            count: 3,
          },
        ],
      },
    });
    await initialSub.save();
    if (savedUser) {
      // CREATE SESSION
      const accessToken = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
      const session = new Session({
        userId: savedUser._id,
        userAgent: req.body.userAgent,
        accessToken: accessToken,
      });
      //Save Session
      const savedSession = await session.save();
      res.header("Authorization", accessToken).json({
        code: 200,
        message: "user loged in",
        result: {
          accessToken: accessToken,
          user: savedUser,
        },
      });
    }
  } catch (error) {
    res.status(400).json({ code: 400, message: error.message, result: [] });
  }
};

//Login User
const login = async (req, res, next) => {
  try {
    // VALIDATE THE USER DETAILES BEFORE REGISTER IT
    req.body.dob = req.body.dob?.toString();
    const { error } = loginValidation(req.body);
    if (error)
      return res
        .status(200)
        .json({ code: 400, message: error.details[0].message, result: [] });

    // CHECK IF THE USER IS ALREADY IN THE DATABASE
    const user = await User.findOne({
      $or: [
        {
          primaryPhone: {
            countryCode: req.body?.phone?.countryCode?.toString(),
            phoneNumber: req.body?.phone?.phoneNumber?.toString(),
          },
        },
        {
          phoneBusiness: {
            countryCode: req.body?.phone?.countryCode?.toString(),
            phoneNumber: req.body?.phone?.phoneNumber?.toString(),
          },
        },
      ],
    });

    if (!user)
      return res
        .status(200)
        .json({ code: 400, message: "wroung phone", result: [] });
    if (!user?.dob) {
      await User.findByIdAndUpdate(
        {
          _id: user?._id,
        },
        { dob: req.body.dob },
        { new: true }
      );
    }

    const userData = user;
    userData["primaryPhone"] = "dfsfsdf";

    // CREATE SESSION
    const accessToken = jwt.sign({ _id: user._id }, TOKEN_SECRET);
    const session = new Session({
      userId: user._id,
      userAgent: req.body.userAgent,
      accessToken: accessToken,
    });
    const dob = req.body.dob;
    const savedSession = await session.save();
    res.header("Authorization", accessToken).json({
      code: 200,
      message: "user loged in",
      result: {
        accessToken: accessToken,
        user: {
          _id: user?._id,
          primaryPhone: `${user.primaryPhone.countryCode}${user?.primaryPhone.phoneNumber}`,
          phoneBusiness: `${user?.phoneBusiness.countryCode}${user?.phoneBusiness.phoneNumber}`,
          businessName: user?.businessName,
          dob: user?.dob,
          firstName: user?.firstName,
          lastName: user?.lastName,
          userPublicId: user?.user_index,
        },
      },
    });
  } catch (error) {
    res.status(400).json({ code: 400, message: error.message, result: [] });
  }
};

//Get User Session
const getUserSession = async (req, res) => {
  // verify("public"),
  try {
    const sessions = await Session.find({ userId: req.query["user-id"] });
    if (!sessions)
      return res.json({ code: 404, message: "sessions not found", result: [] });

    if (sessions.length <= 0)
      return res.json({ code: 404, message: "sessions not found", result: [] });

    res.json({
      code: 200,
      message: sessions.length + "sessions found",
      result: sessions,
    });
  } catch (error) {
    res.status(400).json({ code: 400, message: error.message, result: [] });
  }
};

//Delete User Session
const deleteUserSession = async (req, res) => {
  // verify("public"),
  try {
    const token = req.header("Authorization");

    const session = await Session.findOne({ accessToken: token });
    if (!session)
      return res
        .status(400)
        .json({ code: 400, message: "something went wrong", result: [] });

    await Session.deleteOne({ accessToken: token });

    res.json({
      code: 200,
      message: "user loged out successfully",
      result: [],
    });
  } catch (error) {
    res.status(400).json({ code: 400, message: error.message, result: [] });
  }
};

//Get User Session
const getUserSessionToken = async (req, res) => {
  try {
    const accessToken = jwt.sign({ _id: "anonymous" }, TOKEN_SECRET);
    res.header("Authorization", accessToken).json({
      code: 400,
      message: "token generated",
      result: { accessToken: accessToken, user: null },
    });
  } catch (error) {
    res.status(400).json({ code: 400, message: error.message, result: [] });
  }
};

module.exports = {
  register,
  login,
  getUserSession,
  deleteUserSession,
  getUserSessionToken,
};
