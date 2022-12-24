const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const autoIncrement = require("mongoose-auto-increment");
var connection = mongoose.createConnection(process.env.MONGODB_URI);

const userSchema = new mongoose.Schema(
  {
    userpublicId: { type: Number },
    accountType: { type: String },
    primaryPhone: {
      countryCode: { type: String, default: null },
      phoneNumber: { type: String, default: null },
    },
    email: { type: String },
    phoneBusiness: {
      countryCode: { type: String, default: null },
      phoneNumber: { type: String, default: null },
    },
    dob: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    civilNumber: { type: String, default: null },
    personalImage: { type: Object, default: "" },
    businessImage: { type: Object, default: "" },
    businessName: {
      en: {
        type: String,
        default: null,
      },
      ar: {
        type: String,
        default: null,
      },
    },
    workingHoursMonday: {
      shiftFirst: {
        start: {
          type: String,
          default: null,
        },
        end: {
          type: String,
          default: null,
        },
      },
      shiftSecond: {
        start: {
          type: String,
          default: null,
        },
        end: {
          type: String,
          default: null,
        },
      },
    },
    workingHoursTuesday: {
      shiftFirst: {
        start: {
          type: String,
          default: null,
        },
        end: {
          type: String,
          default: null,
        },
      },
      shiftSecond: {
        start: {
          type: String,
          default: null,
        },
        end: {
          type: String,
          default: null,
        },
      },
    },
    workingHoursWednesday: {
      shiftFirst: {
        start: {
          type: String,
          default: null,
        },
        end: {
          type: String,
          default: null,
        },
      },
      shiftSecond: {
        start: {
          type: String,
          default: null,
        },
        end: {
          type: String,
          default: null,
        },
      },
    },
    workingHoursThursday: {
      shiftFirst: {
        start: {
          type: String,
          default: null,
        },
        end: {
          type: String,
          default: null,
        },
      },
      shiftSecond: {
        start: {
          type: String,
          default: null,
        },
        end: {
          type: String,
          default: null,
        },
      },
    },
    workingHoursFriday: {
      shiftFirst: {
        start: {
          type: String,
          default: null,
        },
        end: {
          type: String,
          default: null,
        },
      },
      shiftSecond: {
        start: {
          type: String,
          default: null,
        },
        end: {
          type: String,
          default: null,
        },
      },
    },
    workingHoursSaturday: {
      shiftFirst: {
        start: {
          type: String,
          default: null,
        },
        end: {
          type: String,
          default: null,
        },
      },
      shiftSecond: {
        start: {
          type: String,
          default: null,
        },
        end: {
          type: String,
          default: null,
        },
      },
    },
    workingHoursSunday: {
      shiftFirst: {
        start: {
          type: String,
          default: null,
        },
        end: {
          type: String,
          default: null,
        },
      },
      shiftSecond: {
        start: {
          type: String,
          default: null,
        },
        end: {
          type: String,
          default: null,
        },
      },
    },
    businessCR: { type: String, default: null },
    businessTaxId: { type: Number, default: null },
    businessGovernorate: { type: String, default: null },
    businessState: { type: String, default: null },
    businessTown: { type: String, default: null },
    langitude: { type: Number, default: null },
    latitude: { type: Number, default: null },
    profileViews: { type: Number, default: 0 },
    accountViews: { type: Number, default: 0 },
    blockedUserId: [{ type: String, default: null }],
    colorMode: { type: String, default: null },
    language: { type: String, default: null },
    vfs_count: { type: Number, default: 0 },
    user_index: { type: Number, default: 0 },
    country: { type: String, default: "Oman" },
    userOldId: { type: String, default: "" },
    forceLogout: { type: Boolean, default: false },
  },
  { collection: "users_records", timestamps: true }
);

userSchema.plugin(require("mongoose-autopopulate"));
autoIncrement.initialize(connection);
userSchema.plugin(mongoosePaginate);
userSchema.plugin(autoIncrement.plugin, {
  model: "user_records",
  field: "user_index",
  startAt: 10535,
  incrementBy: 1,
});

module.exports = mongoose.model("users_records", userSchema);
