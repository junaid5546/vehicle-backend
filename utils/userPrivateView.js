const userModel = require("../src/model/users/authentication/user.model");
const ObjectId = require("mongoose").Types.ObjectId;

const userPrivateView = async (matchObj) => {
  const data = await userModel.aggregate([
    {
      $match: matchObj,
    },
    {
      $set: {
        businessGovernorate: {
          $toObjectId: "$businessGovernorate",
        },
        businessState: {
          $toObjectId: "$businessState",
        },
      },
    },
    {
      $lookup: {
        from: "locations_governorates",
        localField: "businessGovernorate",
        foreignField: "_id",
        as: "businessGovernorate",
      },
    },
    {
      $set: {
        businessGovernorate: {
          $arrayElemAt: ["$businessGovernorate", 0],
        },
      },
    },
    {
      $lookup: {
        from: "locations_states",
        localField: "businessState",
        foreignField: "_id",
        as: "businessState",
      },
    },
    {
      $set: {
        businessState: {
          $arrayElemAt: ["$businessState", 0],
        },
      },
    },
    {
      $project: {
        userPublicId: {
          $ifNull: ["$userPublicId", null],
        },
        accountType: {
          $ifNull: ["$accountType", null],
        },
        primaryPhone: {
          $ifNull: ["$primaryPhone", null],
        },
        secondaryPhone: {
          $ifNull: ["$secondaryPhone", null],
        },
        phoneBusiness: {
          $ifNull: ["$phoneBusiness", null],
        },
        firstName: {
          $ifNull: ["$firstName", null],
        },
        lastName: {
          $ifNull: ["$lastName", null],
        },
        personalImage: {
          $ifNull: ["$personalImage", null],
        },
        businessImage: {
          $ifNull: ["$businessImage", null],
        },
        businessName: {
          $ifNull: ["$businessName", null],
        },
        businessCR: {
          $ifNull: ["$businessCR", null],
        },
        businessTaxId: {
          $ifNull: ["$businessTaxId", null],
        },
        businessGovernorate: 1,
        businessState: 1,
        businessTown: {
          $ifNull: ["$businessTown", null],
        },
        langitude: {
          $ifNull: ["$langitude", null],
        },
        latitude: {
          $ifNull: ["$latitude", null],
        },
        profileViews: {
          $ifNull: ["$profileViews", null],
        },
        accountViews: {
          $ifNull: ["$accountViews", null],
        },
        favourite: {
          $ifNull: ["$favourite", null],
        },

        workingHoursWednesday: {
          $ifNull: ["$workingHoursWednesday", null],
        },
        workingHoursTuesday: {
          $ifNull: ["$workingHoursTuesday", null],
        },
        workingHoursThursday: {
          $ifNull: ["$workingHoursThursday", null],
        },
        workingHoursSunday: {
          $ifNull: ["$workingHoursSunday", null],
        },
        workingHoursSaturday: {
          $ifNull: ["$workingHoursSaturday", null],
        },
        workingHoursMonday: {
          $ifNull: ["$workingHoursMonday", null],
        },
        workingHoursFriday: {
          $ifNull: ["$workingHoursFriday", null],
        },
      },
    },
  ]);
  return data && data[0];
};

module.exports.userPrivateView = userPrivateView;
