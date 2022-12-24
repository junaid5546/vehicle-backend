const router = require("express").Router();
const verify = require("../../../middlewares/verifyToken.middleware.js");
const {
  getUserFavrouitePost,
  checkUserExistByPhone,
  checkUserExistByPhoneAndDob,
  getPublicProfile,
  getPrivateProfile,
  getUserById,
  addToFavorite,
  getAllUsersWithFilter,
  updateUserById,
  deleteUser,
} = require("../../../controllers/user/om/user");

// GET USER FAVS
router.get("/user/favourites", verify, getUserFavrouitePost);

// CHECK USER BY PHONE
router.get("/user", checkUserExistByPhone);

// CHECK USER BY PHONE AND DOB
router.get("/user-2", checkUserExistByPhoneAndDob);

// GET USER PUBLIC PROFILE
router.get("/user/public-profile/:_id", getPublicProfile);

// GET USER PRIVATE PROFILE
router.get("/user/public-private/:_id", getPublicProfile);

// GET USER BY ID
router.get("/user/:_id", getUserById);

// UPDATE USER BY ID
router.put("/user/:_id", updateUserById);

// ADD POST TO FAVORITES
router.post("/user/add-to-favourite", addToFavorite);

// GET USERS
router.get("/users", getAllUsersWithFilter);

router.delete("/delete-user/:user_id", deleteUser);

module.exports = router;
