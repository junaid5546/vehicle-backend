const { postFileUploader } = require("../../../../../utils/multer");
const VFSPostSchema = require("../../../../model/vehicle_for_sale/oman/posts/vehicleForSalePost.model.js");
var moment = require("moment");
const router = require("express").Router();
var fs = require("fs");
const { uniqueFileFilter } = require("../../../../../utils/fileFilter");
const multer = require("multer");
const dotenv = require("dotenv");
const {
  azure_image_upload,
} = require("../../../../../utils/azure_image_upload");
const { deleteBlob } = require("../../../../../utils/azure_blob_delete");
dotenv.config();
const upload = multer();

//*************** UPLOAD POST IMAGES ******************************/
router.post(
  "/storage/post-images/:id",
  upload.array("mediaList"),
  async function (req, res) {
    const vehicleImages = req.files;
    const DB_vehicle = await VFSPostSchema.findById({
      _id: req.params.id,
    }).select("mediaList postId createdAt");

    const year = moment(DB_vehicle?.createdAt).format("YYYY");
    const month = moment(DB_vehicle?.createdAt).format("MM");
    const day = moment().format("DD");
    try {
      if (!DB_vehicle) {
        res.status(404).send({ code: 400, message: "Post not found" });
      } else if (vehicleImages?.length < 1) {
        res
          .status(400)
          .send({ code: 400, message: "Please upload file first" });
      } else {
        const mergeFiles = vehicleImages?.concat(DB_vehicle?.mediaList);
        const saveingImages = uniqueFileFilter(
          mergeFiles,
          (file) => file?.originalname
        ).map((e) => {
          return {
            originalname: e?.originalname,
            url: `${process.env.MEDIA_BASE_URL}/posts/${year}/${month}/${day}/${DB_vehicle?.postId}/${e.originalname}`,
          };
        });
        DB_vehicle.mediaList = saveingImages;
        DB_vehicle.save();
        vehicleImages.map((e) => {
          const pathForImages = `${year}/${month}/${day}/${DB_vehicle?.postId}/${e.originalname}`;
          return azure_image_upload("posts", e, pathForImages);
        });
        res.send({
          code: 200,
          message: "Post images uploaded successfully",
          result: saveingImages,
        });
      }
    } catch (error) {
      res.send({
        code: 400,
        message: error?.message,
      });
    }
  }
);

//*************** DELETE POST IMAGES ******************************/
router.delete("/posts-delete-images-2/:id", async function (req, res) {
  const DB_vehicle = await VFSPostSchema.findById({
    _id: req?.params?.id,
  }).select("mediaList postId createdAt");

  if (!DB_vehicle) {
    res.status(404).send("Post not found");
  }
  //********** Time of post created for getting path of images  */
  const year = moment(DB_vehicle?.createdAt).format("YYYY");
  const month = moment(DB_vehicle?.createdAt).format("MM");
  var createdDate = new Date(DB_vehicle?.createdAt);
  const day = moment(createdDate).format("DD");
  //******************** Images data ****************************/
  const DB_mediaList = DB_vehicle?.mediaList;
  const imageToDelete = req.query["image-name"];
  if (imageToDelete) {
    const filterFiles = DB_mediaList?.filter(
      (e) => e.originalname !== imageToDelete
    );

    // Promise.all();
    await deleteBlob(
      "posts",
      `${year}/${month}/${day}/${DB_vehicle?.postId}/${imageToDelete}`
    );
    DB_vehicle.mediaList = filterFiles;
    DB_vehicle.save();

    res.send({
      code: 200,
      message: "File deleted!",
    });
  } else {
    res.send({
      code: 400,
      message: "please select atleast one image to delete",
    });
  }
});

//*************** DELETE POST IMAGES ******************************/
router.post("/posts-delete-images/:id", async function (req, res) {
  const DB_vehicle = await VFSPostSchema.findById({
    _id: req?.params?.id,
  }).select("mediaList postId createdAt");

  if (!DB_vehicle) {
    res.status(404).send("Post not found");
  }

  //********** Time of post created for getting path of images  */
  const year = moment(DB_vehicle?.createdAt).format("YYYY");
  const month = moment(DB_vehicle?.createdAt).format("MM");
  var createdDate = new Date(DB_vehicle?.createdAt);
  const day = moment(createdDate).format("DD");
  //******************** Images data ****************************/
  const DB_mediaList = DB_vehicle?.mediaList;
  const imagesToDelete = req.body.media_list;
  if (imagesToDelete) {
    const filter_images = DB_mediaList?.filter(
      (e) => !imagesToDelete.includes(e?.originalname)
    );

    await Promise.all(
      imagesToDelete.map(async (e) => {
        return await deleteBlob(
          "posts",
          `${year}/${month}/${day}/${DB_vehicle?.postId}/${e}`
        );
      })
    );

    DB_vehicle.mediaList = filter_images;
    DB_vehicle.save();

    res.send({
      code: 200,
      message: "File deleted!",
    });
  } else {
    res.send({
      code: 400,
      message: "please select atleast one image to delete",
    });
  }
});
module.exports = router;
