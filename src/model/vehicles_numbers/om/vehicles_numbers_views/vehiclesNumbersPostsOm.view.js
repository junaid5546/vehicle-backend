const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const vehiclesNumbersPostsOmView = new mongoose.Schema({
  user: {
    type: Object,
  },
  postId: {
    type: Number,
  },
  vehicleNumberAsString: {
    type: String,
  },
  vehicleNumber: {
    type: Number,
  },
  price: {
    type: Number,
  },
  numberCount: {
    type: Number,
  },
  vehicleLetter: {
    type: Object,
  },
  governorate: {
    type: Object,
  },
  state: {
    type: Object,
  },
  plateType: {
    type: Object,
  },
  transferType: {
    type: Object,
  },
  postStatus: {
    type: Object,
  },
});

vehiclesNumbersPostsOmView.plugin(mongoosePaginate);
module.exports = mongoose.model(
  "vehicles_numbers_posts_view",
  vehiclesNumbersPostsOmView,
  "vehicles_numbers_posts_view"
);
