const router = require("express").Router();
const userSchema = require("../../../../model/users/authentication/user.model.js");
const VFSPostSchema = require("../../../../model/vehicle_for_sale/oman/posts/vehicleForSalePost.model.js");

// USER PROFILE  VIEWS + ALL POSTS VIEWS OF THE USER
router.post("/user/stats/:userId", async (req, res) => {
  try {
    const usersAllPostsViews = await VFSPostSchema.aggregate([
      {
        $match: {
          $expr: {
            $eq: ["$userId", req.params.userId],
          },
        },
      },
      {
        $group: {
          _id: "$userId",
          total: {
            $sum: "$viewCount",
          },
        },
      },
    ]);

    const userData = await userSchema
      .findById({ _id: req.params.userId })
      .select("profileViews");

    return res.json({
      total_views: usersAllPostsViews[0].total + userData.profileViews,
    });
  } catch (error) {
    return res.status(400).json({
      code: 400,
      message: error.message,
      result: [],
    });
  }
});

const statsRouter = (io) => {
  router.get("/stats", async (req, res) => {
    io.emit("receive_stats", {
      sold_externally: await dashboardStats("sold_externally"),
      pendings: await dashboardStats("pending"),
      approved: await dashboardStats("approved"),
      potential_duplicate: await dashboardStats("potential_duplicate"),
      wrong_price: await dashboardStats("wrong_price"),
      rejected: await dashboardStats("rejected"),
      sold_internally: await dashboardStats("sold_externally"),
      duplicate: await dashboardStats("duplicate"),
      not_sold: await dashboardStats("not_sold"),
    });
    res.send("emitted");
  });
  return router;
};

module.exports = router;
module.exports = statsRouter;
