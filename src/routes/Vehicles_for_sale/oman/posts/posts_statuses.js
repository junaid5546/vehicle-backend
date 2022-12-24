const router = require("express").Router();
const statuses = require("../../../../model/vehicle_for_sale/oman/posts/posts_statuses");

// USER PROFILE  VIEWS + ALL POSTS VIEWS OF THE USER
router.get("/post-statuses", async (req, res) => {
  try {
    const data = await statuses.find();
    const dataStructure = data.map((e) => {
      return {
        _id: e._id,
        name: e.statusEn,
      };
    });
    res.send({
      code: 200,
      message: "Records found",
      result: dataStructure,
    });
  } catch (error) {
    return res.status(400).json({
      code: 400,
      message: error.message,
      result: [],
    });
  }
});

module.exports = router;
