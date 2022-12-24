var multer = require("multer");
var mkdirp = require("mkdirp");
var path = require("path");
var moment = require("moment");
var fs = require("fs");
const VFSPostSchema = require("../src/model/vehicle_for_sale/oman/posts/vehicleForSalePost.model.js");

const fileFilter = async (req, file, cb) => {
  if (req.url.includes("post-images")) {
    const DB_vehicle = await VFSPostSchema.findById({
      _id: req.params.id,
    }).select("mediaList createdAt");
    const year = moment(DB_vehicle?.createdAt).format("YYYY");
    const month = moment(DB_vehicle?.createdAt).format("MM");
    var today = new Date(DB_vehicle?.createdAt);
    // const day = today.getDate();
    const day = moment().format("DD");
    if (
      fs.existsSync(
        path.join(
          `/assets/posts/${year}/${month}/${day}/${DB_vehicle?.postId}`,
          file?.originalname
        )
      )
    ) {
      cb(null, false);
      return;
    }
  } else {
    if (req.url.includes("user-images")) {
      if (
        fs.existsSync(
          path.join(`/assets/users/${req.params.id}`, file.originalname)
        )
      ) {
        cb(null, false);
        return;
      }
    } else if (req.url.includes("plan-images")) {
      if (
        fs.existsSync(
          path.join(`/assets/plan/${req.params.id}`, file.originalname)
        )
      ) {
        cb(null, false);
        return;
      }
    } else if (file.fieldname === "imageEn" || file.fieldname === "imageAr") {
      if (
        fs.existsSync(
          path.join(
            `/assets/homepage_banners/${req.params.id}`,
            file.originalname
          )
        )
      ) {
        cb(null, false);
        return;
      }
    }
  }
  cb(null, true);
};
var storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    if (req.url.includes("post-images")) {
      const DB_vehicle = await VFSPostSchema.findById({
        _id: req.params.id,
      }).select("mediaList postId createdAt");
      //********** Time of post created for getting path of images  */
      const year = moment(DB_vehicle?.createdAt).format("YYYY");
      const month = moment(DB_vehicle?.createdAt).format("MM");
      var today = new Date(DB_vehicle?.createdAt);
      // const day = today.getDate();
      const day = moment().format("DD");

      mkdirp(
        path.join(
          process.cwd(),
          `/assets/posts/${year}/${month}/${day}/${DB_vehicle?.postId}`
        ),
        function (err) {
          if (err) {
            return console.error(err);
          }
          cb(
            null,
            `./assets/posts/${year}/${month}/${day}/${DB_vehicle?.postId}`
          );
        }
      );
    } else if (req.url.includes("user-images")) {
      mkdirp(
        path.join(process.cwd(), `/assets/users/${req.params.id}`),
        function (err) {
          if (err) {
            return console.error(err);
          }
          cb(null, `./assets/users/${req.params.id}`);
        }
      );
    } else if (req.url.includes("plan-images")) {
      mkdirp(
        path.join(process.cwd(), `/assets/plan/${req.params.id}`),
        function (err) {
          if (err) {
            return console.error(err);
          }
          cb(null, `./assets/plan/${req.params.id}`);
        }
      );
    } else if (file.fieldname === "imageEn" || file.fieldname === "imageAr") {
      mkdirp(
        path.join(process.cwd(), `/assets/homepage_banners`),
        function (err) {
          if (err) {
            return console.error(err);
          }
          cb(null, `./assets/homepage_banners`);
        }
      );
    } else {
      mkdirp(path.join(process.cwd(), `/assets/xlsx`), function (err) {
        if (err) {
          return console.error(err);
        }
        cb(null, `./assets/xlsx`);
      });
    }
  },
  filename: function (req, file, cb) {
    if (req.url.includes("user-images")) {
      const originalname = file.originalname;
      cb(null, `${req.params.id}${originalname}`);
    } else if (file.fieldname === "imageEn") {
      const originalname = file.originalname;
      cb(null, `en_${originalname}`);
    } else if (file.fieldname === "imageAr") {
      const originalname = file.originalname;
      cb(null, `ar_${originalname}`);
    } else if (req.url.includes("post-images")) {
      const originalname = file.originalname;
      cb(null, `${originalname}`);
    } else {
      const originalname = file.originalname;
      cb(null, `${originalname}`);
    }
  },
});

var upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

const postFileUploader = upload.array("mediaList");
const usersFileUploader = upload.fields([
  { name: "personalImage", maxCount: 1 },
  { name: "businessImage", maxCount: 1 },
]);
const bannerileUploader = upload.fields([
  { name: "imageEn", maxCount: 1 },
  { name: "imageAr", maxCount: 1 },
]);
const planfileUploader = upload.array("plan");
const fileCsv = upload.array("csv");
const uploadToAzure = multer();

module.exports.postFileUploader = postFileUploader;
module.exports.usersFileUploader = usersFileUploader;
module.exports.planfileUploader = planfileUploader;
module.exports.fileCsv = fileCsv;
module.exports.bannerileUploader = bannerileUploader;
