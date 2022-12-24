const router = require("express").Router();
const { fileCsv } = require("../../utils/multer");
const csvtojsonV2 = require("csvtojson");
const VFSPostSchema = require("../model/vehicle_for_sale/oman/posts/vehicleForSalePost.model");

var mkdirp = require("mkdirp");
var path = require("path");
var moment = require("moment");
var fs = require("fs");
var http = require("http");
var https = require("node:https");

router.post("/csv-data", fileCsv, async (req, res) => {
  try {
    const csvFilePath = req.files[0].path;
    const csvFilePath2 = req.files[1].path;

    const jsonArray = await csvtojsonV2().fromFile(csvFilePath);
    const jsonArray2 = await csvtojsonV2().fromFile(csvFilePath2);

    const failedCases = [];
    const successCases = [];

    console.log("look for this");
    const getUrlsImages = (id) => {
      return jsonArray2?.filter((e) => e.ID == id)[0]?.guid;
    };
    //create ugly image structure into numeric form / and add first image into the start of the media list
    const structure = jsonArray.map((e, cb) => {
      var imageString = e.gallery;
      let filtered = imageString
        .replace(/\D+/g, " ")
        .trim()
        .split(" ")
        .filter((num) => num.length > 2)
        .map((e) => parseInt(e));
      e.mediaList = filtered;
      delete e.gallery;
      e.mediaList = e.mediaList.map((e) => getUrlsImages(e));
      e.mediaList.unshift(e.first_image);
      delete e.first_image;

      const year = moment(e?.createdAt, "yyyy-MM-DD").format("YYYY");
      const month = moment(e?.createdAt, "yyyy-MM-DD").format("MM");
      const day = moment(e?.createdAt, "yyyy-MM-DD").format("DD");

      console.log(e);

      mkdirp(
        path.join(
          process.cwd(),
          `/assets/posts/${year}/${month}/${day}/${e?.postId}`
        ),
        async function (err) {
          if (err) {
            return console.error(err);
          }

          let media_list = [];
          await Promise.all(
            e.mediaList.map(async (element, i) => {
              await downloadImage(
                element,
                `./assets/posts/${year}/${month}/${day}/photo-${i}.jpg`
              )
                .then((m) => {
                  media_list.push({ originalname: `photo-${i}.jpg`, url: m });
                })
                .catch(console.error);
            })
          );

          if (e._id.length === 12) {
            const updatePost = await VFSPostSchema.findByIdAndUpdate(
              { _id: e._id },
              { $set: { mediaList: media_list } }
            );
          }
        }
      );

      return e;
    });

    console.log("Done");
    res.json({
      structure,
    });
  } catch (error) {
    res.status(400).json({ code: 400, message: error.message, result: [] });
  }
});

function downloadImage(url, filepath) {
  var client = http;
  if (url.toString().indexOf("https") === 0) {
    client = https;
  }

  return new Promise((resolve, reject) => {
    try {
      client.get(url, (res) => {
        if (res.statusCode === 200) {
          res
            .pipe(fs.createWriteStream(filepath))
            .on("error", reject)
            .once("close", () => resolve(filepath));
        } else {
          // Consume response data to free up memory
          res.resume();
          reject(
            new Error(`Request Failed With a Status Code: ${res.statusCode}`)
          );
        }
      });
    } catch (error) {
      console.log(error.message);
    }
  });
}
module.exports = router;
