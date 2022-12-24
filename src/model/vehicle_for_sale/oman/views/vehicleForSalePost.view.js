const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const VFSPostViewSchema = new mongoose.Schema(
  {
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
    distancekilometer: {
      type: Number,
    },
    levelDetails: {
      type: Object,
    },
    user_governate: {
      type: Object,
    },
    user_state: {
      type: Object,
    },
    items: [{ type: Object }],
    title: { type: Object },
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
    post_counts: { type: Number, default: 0 },
    post_status: { type: String, default: "pending" },
    statusCode: { type: Number, default: 0 },
    price: { type: Number },
    user: {
      type: Object,
    },
    post_type: { type: Object },
    sellerNotes: { type: String },
    seller_notes: { type: String, default: "", required: false },
    postId: { type: Number },
    saleTypeId: {
      type: String,
    },
    mediaList: {
      type: Array,
    },
  },
  { collection: "vehicles_for_sale_posts_app_view" }
);

VFSPostViewSchema.plugin(mongoosePaginate);
VFSPostViewSchema.index({
  post_status: 1,
  seller_notes: 1,
  "filterItem.id": 1,
  "filterItem.key": 1,
});

VFSPostViewSchema.plugin(aggregatePaginate);

module.exports = mongoose.model(
  "vehicles_for_sale_posts_app_view",
  VFSPostViewSchema,
  "vehicles_for_sale_posts_app_view"
);
