const router = require("express").Router();
const user_subscriptions_record = require("../../model/users/subscriptions/users_subscriptions_records_om");

// Create Banner
router.post("/change-free-count", async (req, res) => {
  try {
    const count = parseInt(req.query?.count ?? 0);
    if (count) {
      const subs = await user_subscriptions_record.updateMany(
        {
          "user_subscriptons.type": "Free",
          "user_subscriptons.$.post_types.post_type_id":
            "62e40a9be0ffd1f52de88309",
        },
        {
          $set: {
            "user_subscriptons.$.post_types.$[p]": {
              post_type_id: "62e40a9be0ffd1f52de88309",
              count: count,
            },
          },
        },
        {
          arrayFilters: [{ "p.post_type_id": "62e40a9be0ffd1f52de88309" }],
        }
      );
      res.send(subs);
    } else {
      res.send("please send count to update");
    }
  } catch (error) {
    return res.status(400).json({
      code: 400,
      message: error.message,
      result: [],
    });
  }
});

module.exports = router;
