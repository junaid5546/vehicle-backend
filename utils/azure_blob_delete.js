const { BlobServiceClient } = require("@azure/storage-blob");

const blobServiceClient = BlobServiceClient.fromConnectionString(
  process.env.CONNECTION_STRING
);
async function deleteBlob(container, blobName) {
  try {
    // include: Delete the base blob and all of its snapshots.
    // only: Delete only the blob's snapshots and not the blob itself.
    const options = {
      deleteSnapshots: "include", // or 'only'
    };
    //get container of the blob
    const containerClient = blobServiceClient.getContainerClient(container);
    // Create blob client from container client
    const blockBlobClient = await containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.delete(options);
  } catch (error) {}
}

module.exports.deleteBlob = deleteBlob;
