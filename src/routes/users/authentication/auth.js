const router = require("express").Router();
const verify = require("./verifyToken.middleware");
const {
  register,
  login,
  getUserSession,
  deleteUserSession,
  getUserSessionToken,
} = require("../../../controllers/user/om/auth");

// USER REGISTER
router.post("/register", register);

// LOGIN USER
router.post("/sessions", login);

// GET USER SESSIONS
router.get("/sessions", getUserSession);

// LOGOUT USER
router.delete("/sessions", deleteUserSession);

// GET ACCESS TOKEN
router.get("/sessions/token", getUserSessionToken);

module.exports = router;
