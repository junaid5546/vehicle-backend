var fs = require("fs");
const router = require("express").Router();
const userSchema = require("../../../model/users/authentication/user.model.js");
// const config = require("../../../config.json");
const { postFileUploader } = require("../../../../utils/multer.js");
const dotenv = require("dotenv");
const {
  azure_image_upload,
} = require("../../../../utils/azure_image_upload.js");
dotenv.config();

const multer = require("multer");
const { deleteBlob } = require("../../../../utils/azure_blob_delete.js");

const upload = multer();

router.post(
  "/storage/user-images/:id",
  upload.array("mediaList"),
  async function (req, res) {
    const userID = req.params.id;
    const currentUser = await userSchema.findById(userID);
    let responseOBJ = "";
    if (!currentUser) {
      res.status(400).send({ code: 400, message: "User Id Not Founds" });
    } else {
      const files = req?.files;
      const file = req?.files[0];
      const userImagesType =
        req.files && req.files[0] && req.files[0].originalname;
      function removeExtension(filename) {
        return filename?.substring(0, filename?.lastIndexOf(".")) || filename;
      }
      if (files?.length < 1) {
        res
          .status(400)
          .send({ code: 400, message: "Please upload file first" });
      } else {
        const dataOBJ = {};
        const personalImageOBJ = {};
        const businessImageOBJ = {};

        if (removeExtension(userImagesType) == "profile") {
          const commingImage = userImagesType;
          personalImageOBJ.name = commingImage;
          personalImageOBJ.url = `${process.env.MEDIA_BASE_URL}/users/${currentUser.user_index}/${commingImage}`;
          dataOBJ.personalImage = personalImageOBJ;
          responseOBJ = `${process.env.MEDIA_BASE_URL}/users/${currentUser.user_index}/${commingImage}`;
          const deletingFileName = `${currentUser.user_index}/${currentUser.personalImage.name}`;
          await deleteBlob("users", deletingFileName);
          const fileName = `${currentUser.user_index}/${commingImage}`;
          azure_image_upload("users", file, fileName);
        }
        if (removeExtension(userImagesType) === "cover") {
          const commingbusinessImage = userImagesType;
          businessImageOBJ.name = commingbusinessImage;
          businessImageOBJ.url = `${process.env.MEDIA_BASE_URL}/users/${currentUser.user_index}/${commingbusinessImage}`;
          dataOBJ.businessImage = businessImageOBJ;
          responseOBJ = `${process.env.MEDIA_BASE_URL}/users/${currentUser.user_index}/${commingbusinessImage}`;
          const deletingFileName = `${currentUser.user_index}/${currentUser.businessImage.name}`;
          await deleteBlob("users", deletingFileName);
          const fileName = `${currentUser.user_index}/${commingbusinessImage}`;
          azure_image_upload("users", file, fileName);
        }
        await userSchema.findByIdAndUpdate({ _id: userID }, dataOBJ, {
          new: true,
        });
      }
      res.status(200).send({
        code: 200,
        message: "Successfully Updated",
        response: responseOBJ,
        file: req?.files,
      });
    }
  }
);

module.exports = router;
