const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const autoIncrement = require("mongoose-auto-increment");
var connection = mongoose.createConnection(process.env.MONGODB_URI);

const VFSPostSchema = new mongoose.Schema(
  {
    postId: {
      type: Number,
    },
    oldPostId: {
      type: String,
    },
    // active: {
    //   type: Boolean,
    //   default: false,
    // },
    user_id: {
      type: String,
      // required: true,
    },
    primary_phone: {
      type: String,
    },
    body_id: {
      type: String,
    },
    year_id: {
      type: String,
    },
    condition_id: {
      type: String,
    },
    make_id: {
      type: String,
    },
    model_id: {
      type: String,
    },
    trim_id: {
      type: String,
    },
    price: {
      type: Number,
      default: 0,
    },
    sale_type_id: {
      type: String,
    },
    exterior_color_id: {
      type: String,
    },
    door_count_id: {
      type: String,
    },
    seats_type_id: {
      type: String,
    },
    interior_color_id: {
      type: String,
    },
    engine_size: {
      type: String,
    },
    cylinder_count_id: {
      type: String,
    },
    fuel_type_id: {
      type: String,
    },
    distance_kilometer: {
      type: Number,
    },
    distance_mile: {
      type: Number,
    },
    drivetrain_id: {
      type: String,
    },
    transmission_type_id: {
      type: String,
    },
    origin_id: {
      type: String,
    },
    governorate_id: {
      type: String,
    },
    state_id: {
      type: String,
    },
    warranty_duration_id: {
      type: String,
    },
    warranty_kilometer: {
      type: String,
    },
    insurance_type_id: {
      type: String,
    },
    readiness_id: {
      type: String,
    },
    plate_type_id: {
      type: String,
    },
    vin: {
      type: String,
    },
    modifyRecord: [
      {
        modifierId: { type: String },
        modifyAt: { type: Date },
      },
    ],
    mediaList: {
      type: Array,
      default: [],
    },
    features_id_array: [
      {
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
    seller_notes: {
      type: String,
      default: null,
      required: false,
    },
    statusCode: {
      type: Number,
    },
    post_status: {
      type: String,
      default: "627925bfda535aadb15ef3d3",
    },
    post_type: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "master_post_level_single",
      },
      startDate: { type: Date },
      endDate: { type: Date },
      order: { type: Number },
    },
    view_count: {
      type: Number,
      default: 0,
    },
    favorite_count: {
      type: Number,
      default: 0,
    },
    chat_count: {
      type: Number,
      default: 0,
    },
    whatsapp_count: {
      type: Number,
      default: 0,
    },
    postIdOld: {
      type: Number,
      default: 0,
    },
    call_count: {
      type: Number,
      default: 0,
    },
    post_type_records: {
      type: Array,
      default: [],
    },
    sorted_date: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true }
);

autoIncrement.initialize(connection);
VFSPostSchema.plugin(autoIncrement.plugin, {
  model: "vehicles_for_sale_posts",
  field: "postId",
  startAt: 42000,
  incrementBy: 1,
});
VFSPostSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("vehicles_for_sale_posts", VFSPostSchema);
