const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const VFSPostViewDashboardSchema = new mongoose.Schema({
  featuersList: [
    {
      featureEn: {
        type: String,
      },
      featureAr: {
        type: String,
      },
      featureIcon: {
        type: String,
      },
      name: {
        type: String,
      },
    },
  ],
  levelDetails: {
    type: Object,
  },
  items: [{ type: Object }],
  filterItem: [
    {
      key: {
        type: String,
      },
      value: {
        type: String,
      },
      id: {
        type: String,
      },
    },
  ],
  title: { type: Object },
  post_status: { type: String, default: "" },
  statusCode: { type: Number, default: 0 },
  price: { type: Number },
  postId: { type: Number },
  sellerNotes: { type: String },
  seller_notes: { type: String, default: "", required: false },
  postId: { type: Number },
  saleTypeId: {
    type: String,
  },
  post_type: { type: Object },
  user: {
    type: Object,
  },
  mediaList: {
    type: Array,
  },
});

VFSPostViewDashboardSchema.plugin(mongoosePaginate);

module.exports = mongoose.model(
  "vehicles_for_sale_posts_dashboard_view",
  VFSPostViewDashboardSchema,
  "vehicles_for_sale_posts_dashboard_view"
);
