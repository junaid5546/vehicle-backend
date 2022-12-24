const { Router } = require("express");
const multer = require("multer");
const { BlobServiceClient } = require("@azure/storage-blob");
const upload = multer();
const router = Router();

const blobServiceClient = BlobServiceClient.fromConnectionString(
  process.env.CONNECTION_STRING
);

router.post("/create-blob", upload.single("file"), (req, res) => {
  try {
    const { container } = req.body;
    const { originalname, buffer } = req.file;

    const blobOptions = {
      blobHTTPHeaders: { blobContentType: "image" },
    };
    const containerClient = blobServiceClient.getContainerClient(container);
    containerClient
      .getBlockBlobClient("2022/10/30/" + originalname)
      .uploadData(buffer, blobOptions);

    res.send({ code: 200, message: "success" });
  } catch (error) {
    res.send({ code: 400, message: error.message });
  }
});

module.exports = router;
