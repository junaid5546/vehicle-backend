const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const express = require("express");
const { verify } = require("./verifyToken.js");
const User = require("../../../model/employees/om/users_employees");
const { hasRole } = require("./hasRole");
const { tokenVerify } = require("./token.js");

const REACT_APP_TOKEN_SECRET = process.env.TOKEN_SECRET;
const router = express.Router();

router.post(
  "/employee-register",
  // tokenVerify,
  // hasRole("admin"),
  async (req, res) => {
    //check if user exist
    try {
      const dbUser = await User.findOne({
        $or: [
          { workPhone: req.body.workPhone },
          { workEmail: req.body.workEmail },
          { dateOfBirth: req.body.dateOfBirth },
          { civilNumber: req.body.civilNumber },
        ],
      });
      if (dbUser) return res.status(400).send("User Already Exist");
      else {
        //Hased Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        req.body.password = hashedPassword;
        req.body.personalEmail = req.body.personalEmail.toLowerCase();
        req.body.workEmail = req.body.workEmail.toLowerCase();

        //Register a new User
        const user = new User(req.body);
        //Save user to DB
        const newUser = await user.save();
        //Create and Assign Token
        const token = jwt.sign(
          { _id: newUser._id, role: newUser.user_role },
          REACT_APP_TOKEN_SECRET
        );
        res.header("auth-token", token).send({ token: token, user: newUser });
      }
    } catch (err) {
      const errors = Object.keys(err?.errors);
      res.status(400).send({
        message: `${errors[0]} is required`,
      });
    }
  }
);

router.post("/employee-login", async (req, res) => {
  try {
    //check if user exist
    const dbUser = await User.findOne({
      workPhone: req.body.workPhone,
      workEmail: req.body.workEmail,
      dateOfBirth: req.body.dateOfBirth,
      civilNumber: req.body.civilNumber,
    });

    if (!dbUser) {
      return res.status(400).send(`User Doesn't exist`);
    } else {
      //     //Match Password
      const validPassword = dbUser
        ? bcrypt?.compare(req.body?.password, dbUser?.password)
        : null;
      if (!validPassword) return res.status(400).send("Password is incorrect");

      //Create and Assign Token
      const token = jwt.sign(
        { _id: dbUser._id, role: dbUser.user_role },
        REACT_APP_TOKEN_SECRET
      );
      res.header("auth-token", token).send({ token: token, user: dbUser });
    }
  } catch (err) {
    res.status(400).send({
      message: err.message,
    });
  }
});

router.get("/me", async (req, res) => {
  try {
    const token = req.header("auth-token");
    const userId = req.user._id;
    const dbUser = await User.findOne({ _id: userId });
    if (!dbUser) return res.status(400).send(`User Doesn't exist`);
    res.send({ token: token, user: dbUser });
  } catch (err) {
    res.status(401).send("Invalid User");
  }
});

router.post("/profile", async (req, res) => {
  try {
    //Extract the verified user _id -  added from verify Middleware
    const userId = req.body.id;
    const dbUser = await User.findOne({ _id: userId });
    if (!dbUser) return res.status(400).send(`User Doesn't exist`);
    res.send({ user: dbUser });
  } catch (err) {
    res.status(401).send("Invalid User");
  }
});

router.patch("/updateprofile/:id", async (req, res) => {
  //Check for vlidation
  try {
    const body = req.body;
    User.findOneAndUpdate(
      { _id: req.params.id },
      body,
      { new: true },
      (err, data) => {
        if (err) {
        }
        res.send({ code: 200, user: data });
      }
    );
  } catch (err) {
    res.status(404).send({
      code: 404,
      message: err.message,
    });
  }
});

//RESET PASSWORD
router.patch("/reset/password/:id", async (req, res) => {
  const id = req.params.id;
  //encrypt password before saving into DB
  const options = { new: true };
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  await User.findOneAndUpdate(
    { _id: id },
    { password: hashedPassword },
    options
  );

  res.send(hashedPassword);
});
module.exports = router;
