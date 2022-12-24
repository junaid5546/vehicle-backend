const VFSPostSchema = require("../src/model/vehicle_for_sale/oman/posts/vehicleForSalePost.model.js");

const dashboardStats = async (post_status) => {
  return await VFSPostSchema.find({ post_status }).count().lean();
};

module.exports.dashboardStats = dashboardStats;
