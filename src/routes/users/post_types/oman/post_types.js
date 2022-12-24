const router = require("express").Router();
const { langHandler } = require("../../../../../utils/languageHandler");
const { postTypeLefts } = require("../../../../../utils/postTypeslLeft");
const Post_types = require("../../../../model/users/posts_types/post_types");

router.post("/post-types", async (req, res) => {
  try {
    const newPost_types = new Post_types(req.body);
    const savePost_types = await newPost_types.save();
    res.status(200).json({
      code: 200,
      message: "Successfully created",
      result: savePost_types,
    });
  } catch (error) {
    return res.status(400).json({
      code: 400,
      message: error.message,
      result: [],
    });
  }
});

router.get("/post-types/", async (req, res) => {
  try {
    const lang = req.query?.lang ?? "en";
    const user_id = req.query["user-id"];
    if (!user_id) {
      return res.status(400).json({
        code: 400,
        message: "please send user-id in params",
        result: [],
      });
    }
    const getPost_types = await Post_types.find({
      durationDays: req.query?.days ?? 8,
      department_id: "62dbded3c383516fd37ffb3e",
    });
    const postypes = await Promise.all(
      getPost_types.map(async (e) => {
        const postTypes = await postTypeLefts(user_id, e?._id);
        return {
          key: e?.key,
          post_type_name: langHandler(e.nameAr, e.nameEn, lang),
          post_type_duration: e?.durationDays,
          price: postTypes > 0 ? 0 : e?.price,
          _id: e._id,
          order: e?.order,
          duration_offset: e?.durationOffset,
          hook: langHandler(e.hookAr, e.hookEn, lang),
          remaining: await postTypeLefts(user_id, e?._id),
        };
      })
    );

    res.status(200).json({
      code: 200,
      message: "record founded",
      result: postypes,
    });
  } catch (error) {
    return res.status(400).json({
      code: 400,
      message: error.message,
      result: [],
    });
  }
});

router.get("/all-post-types/", async (req, res) => {
  try {
    const lang = req.query?.lang ?? "en";
    const user_id = req.query["user-id"];
    if (!user_id) {
      return res.status(400).json({
        code: 400,
        message: "please send user-id in params",
        result: [],
      });
    }
    const getPost_types_for_7_days = await Post_types.find({
      durationDays: 7,
      department_id: "62dbded3c383516fd37ffb3e",
    });
    const postypes = await Promise.all(
      getPost_types_for_7_days.map(async (e) => {
        const postTypes = await postTypeLefts(user_id, e?._id);
        return {
          key: e?.key,
          post_type_name: langHandler(e.nameAr, e.nameEn, lang),
          post_type_duration: e?.durationDays,
          price: postTypes > 0 ? 0 : e?.price,
          _id: e._id,
          order: e?.order,
          duration_offset: e?.durationOffset,
          hook: langHandler(e.hookAr, e.hookEn, lang),
          remaining: await postTypeLefts(user_id, e?._id),
          department_id: e.department_id,
        };
      })
    );

    const getPost_types_for_14_days = await Post_types.find({
      durationDays: 14,
      department_id: "62dbded3c383516fd37ffb3e",
    });
    const postypes_14_days = await Promise.all(
      getPost_types_for_14_days.map(async (e) => {
        const postTypes = await postTypeLefts(user_id, e?._id);
        return {
          key: e?.key,
          post_type_name: langHandler(e.nameAr, e.nameEn, lang),
          post_type_duration: e?.durationDays,
          price: postTypes > 0 ? 0 : e?.price,
          _id: e._id,
          order: e?.order,
          duration_offset: e?.durationOffset,
          hook: langHandler(e.hookAr, e.hookEn, lang),
          remaining: await postTypeLefts(user_id, e?._id),
          department_id: e.department_id,
        };
      })
    );

    const getPost_types_for_21_days = await Post_types.find({
      durationDays: 21,
      department_id: "62dbded3c383516fd37ffb3e",
    });
    const postypes_21_days = await Promise.all(
      getPost_types_for_21_days.map(async (e) => {
        const postTypes = await postTypeLefts(user_id, e?._id);
        return {
          key: e?.key,
          post_type_name: langHandler(e.nameAr, e.nameEn, lang),
          post_type_duration: e?.durationDays,
          price: postTypes > 0 ? 0 : e?.price,
          _id: e._id,
          order: e?.order,
          duration_offset: e?.durationOffset,
          hook: langHandler(e.hookAr, e.hookEn, lang),
          remaining: await postTypeLefts(user_id, e?._id),
          department_id: e.department_id,
        };
      })
    );

    const getPost_types_for_30_days = await Post_types.find({
      durationDays: 30,
      department_id: "62dbded3c383516fd37ffb3e",
    });
    const postypes_30_days = await Promise.all(
      getPost_types_for_30_days.map(async (e) => {
        const postTypes = await postTypeLefts(user_id, e?._id);
        return {
          key: e?.key,
          post_type_name: langHandler(e.nameAr, e.nameEn, lang),
          post_type_duration: e?.durationDays,
          price: postTypes > 0 ? 0 : e?.price,
          _id: e._id,
          order: e?.order,
          duration_offset: e?.durationOffset,
          hook: langHandler(e.hookAr, e.hookEn, lang),
          remaining: await postTypeLefts(user_id, e?._id),
          department_id: e.department_id,
        };
      })
    );

    const getPost_types_basic = await Post_types.find({
      durationDays: 60,
      department_id: "62dbded3c383516fd37ffb3e",
    });
    const postypes_basic_days = await Promise.all(
      getPost_types_basic.map(async (e) => {
        const postTypes = await postTypeLefts(user_id, e?._id);
        return {
          key: e?.key,
          post_type_name: langHandler(e.nameAr, e.nameEn, lang),
          post_type_duration: e?.durationDays,
          price: postTypes > 0 ? 0 : e?.price,
          _id: e._id,
          order: e?.order,
          duration_offset: e?.durationOffset,
          hook: langHandler(e.hookAr, e.hookEn, lang),
          remaining: await postTypeLefts(user_id, e?._id),
          department_id: e.department_id,
        };
      })
    );

    res.status(200).json({
      code: 200,
      message: "record founded",
      result: {
        seven_days: postypes,
        fourteen_days: postypes_14_days,
        twenty_one_days: postypes_21_days,
        thirty_days: postypes_30_days,
        basic_days: postypes_basic_days[0],
      },
    });
  } catch (error) {
    return res.status(200).json({
      code: 200,
      message: error.message,
      result: [],
    });
  }
});
module.exports = router;
