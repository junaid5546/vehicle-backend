const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    firstName: { required: true, type: String },
    middleName: { required: true, type: String },
    lastName: { required: true, type: String },
    personalPhone: {
      countryCode: { required: true, type: String, default: null },
      phoneNumber: { required: true, type: String, default: null },
    },
    workPhone: {
      countryCode: { required: true, type: String, default: null },
      phoneNumber: { required: true, type: String, default: null },
    },
    personalEmail: { required: true, type: String },
    workEmail: { required: true, type: String },
    dateOfHire: { required: true, type: String },

    dateOfBirth: { required: true, type: String },
    password: { required: true, type: String },
    civilNumber: { required: true, type: String },
    permissionPages: { required: false, type: String },
    colorScheme: { required: true, type: String },
    forceLogout: { required: true, type: String },
    user_role: { required: true, type: String },
  },
  { collection: "users_employees", timestamps: true }
);

module.exports = mongoose.model("users_employees", userSchema);
