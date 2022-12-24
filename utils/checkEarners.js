const offers = require("../src/model/offers/oman/offerAvailed.js");

const checkOffersEarners = async (offerId) => {
  const getCount = await offers.aggregate([
    {
      $unwind: {
        path: "$offers_avial",
        includeArrayIndex: "string",
      },
    },
    {
      $match: {
        "offers_avial.offerId": offerId.toString(),
      },
    },
    {
      $count: "offerId",
    },
  ]);
  return getCount[0]?.offerId ?? 0;
};

module.exports.checkOffersEarners = checkOffersEarners;
