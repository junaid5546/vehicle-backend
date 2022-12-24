const { BlobServiceClient } = require("@azure/storage-blob");

const blobServiceClient = BlobServiceClient.fromConnectionString(
  process.env.CONNECTION_STRING
);
const azure_image_upload = (container, file, filename) => {
  try {
    const { buffer } = file;
    const blobOptions = {
      blobHTTPHeaders: { blobContentType: "image" },
    };
    const containerClient = blobServiceClient.getContainerClient(container);
    containerClient
      .getBlockBlobClient(filename)
      .uploadData(buffer, blobOptions);
  } catch (error) {}
};

module.exports.azure_image_upload = azure_image_upload;
