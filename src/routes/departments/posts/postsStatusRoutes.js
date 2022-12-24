const router = require("express").Router();
const postsStatus = require("../../../model/departments/posts/postsStatus.model.js");
const { addPostStatus } = require("../validation.js");
const { langHandler } = require("../../../../utils/languageHandler.js");

// GET ALL POSTS STATUS
router.get("/post-statuses", async (req, res) => {
  let lang = req.header("lang");
  try {
    const status = await postsStatus.find();

    res.status(200).json({
      code: 200,
      message: status.length + " status found",
      result: status,
    });
  } catch (error) {
    return res.status(400).json({
      code: 400,
      message: error.message,
      result: [],
    });
  }
});

// CREATE NEW POST STATUS
router.post("/posts-status", async (req, res) => {
  try {
    const { error } = addPostStatus(req.body);
    if (error)
      return res.status(400).json({
        code: 3,
        message: error.details[0].message,
        result: [],
      });

    const newStatus = new postsStatus({
      statusEn: req.body["status-en"],
      statusAr: req.body["status-ar"],
    });

    const status = await newStatus.save();

    res.json({
      code: 200,
      message: "new post status added successfully",
      result: status,
    });
  } catch (error) {
    return res.status(400).json({
      code: 400,
      message: error.message,
      result: [],
    });
  }
});

// UPDATE POST STATUS
router.patch("/posts-status/:_id", async (req, res) => {
  try {
    const { error } = addPostStatus(req.body);
    if (error)
      return res.status(400).json({
        code: 3,
        message: error.details[0].message,
        result: [],
      });

    const postStatus = await postsStatus.findOneAndUpdate(
      {
        _id: req.params._id,
      },
      {
        statusEn: req.body["status-en"],
        statusAr: req.body["status-ar"],
      }
    );

    res.json({
      code: 200,
      message: "status updated successfully",
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

// DELETE POST STATUS
router.delete("/posts-status/:_id", async (req, res) => {
  try {
    const post = await postsStatus.findByIdAndDelete({ _id: req.params._id });

    res.json({
      code: 200,
      message: "status deleted successfully",
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

module.exports = router;
