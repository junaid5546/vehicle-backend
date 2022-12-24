var _ = require("lodash");

// FUNCTION FOR GENERATE CUSTOM QUERY FOR FILTERED POSTS
async function generateQuery(filters) {
  let query = [];

  if (Object.keys(filters).length === 0) return query;

  let keys = Object.keys(filters);

  keys.forEach((element) => {
    if (element !== []) {
      if (element == "price") {
        query.push({
          price: { $gte: filters.price.min, $lte: filters.price.max },
        });
      } else if (element.startsWith("K")) {
        let key = element.substring(1);
        query.push({
          $and: [
            {
              "filterItem.value": { $in: filters[element] },
            },
            { "filterItem.key": _.startCase(_.toLower(key)) },
          ],
        });
      } else {
        query.push({
          $and: [
            {
              "items.value.nameEn": { $in: filters[element] },
            },
            { "items.key": _.startCase(_.toLower(element)) },
          ],
        });
      }
    } else {
      return;
    }
  });
  return query;
}

// FUNCTION FOR GENERATE CUSTOM SORT OBJECT
async function getSortType(sort) {
  let sortType = {};
  // sortType.post_type = { order: 1 };
  // sortType.post_type = { $meta: "order" };
  // price_low, price_hight,date_new, date_old, kilometer_low, kilometer_high, year_new, year_old
  switch (sort) {
    case "price_low":
      sortType["price"] = 1;
      break;
    case "price_high":
      sortType["price"] = -1;
      break;
    case "kilometer_low":
      sortType["distance_kilometer"] = 1;
      break;
    case "kilometer_high":
      sortType["distance_kilometer"] = -1;
      break;
    case "year_new":
      sortType["year"] = -1;
      break;
    case "year_old":
      sortType["year"] = 1;
      break;
    case "date_old":
      sortType["postId"] = 1;
      break;
    case "date_new":
      sortType["postId"] = -1;
      break;
    default:
      sortType["createdAt"] = -1;
  }

  return sortType;
}

// FUNCTION FOR GENERATE CUSTOM SORT OBJECT
async function getVehiclesNumberSortType(sort) {
  let sortType = {};

  // price_low, price_hight, date_new, date_old, number_asc, number_des,
  // letter_ar_asc, letter_ar_asc, letter_en_asc, letter_en_asc

  switch (sort) {
    case "price-low":
      sortType["price"] = 1;
      break;
    case "price_high":
      sortType["price"] = -1;
      break;
    case "number_asc":
      sortType["vehicleNumber"] = 1;
      break;
    case "number_des":
      sortType["vehicleNumber"] = -1;
      break;
    case "letter_ar_asc":
      sortType["vehicleLetter.nameAr"] = 1;
      break;
    case "letter_ar_des":
      sortType["vehicleLetter.nameEn"] = -1;
      break;
    case "letter_en_asc":
      sortType["vehicleLetter.nameAr"] = 1;
      break;
    case "letter_en_des":
      sortType["vehicleLetter.nameEn"] = -1;
      break;
    case "date_old":
      sortType["createdAt"] = 1;
      break;
    default:
      sortType["createdAt"] = -1;
  }

  return sortType;
}

module.exports.getVehiclesNumberSortType = getVehiclesNumberSortType;
module.exports.generateQuery = generateQuery;
module.exports.getSortType = getSortType;
