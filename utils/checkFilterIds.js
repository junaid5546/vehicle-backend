const { filtersId } = require("../src/data/filterids");
const checkFilterIds = (searchFilter) => {
  let newArray = [];
  searchFilter.map((e) => {
    if (filtersId.includes(e)) {
      newArray.push(e);
    }
  });
  return newArray;
};

module.exports.checkFilterIds = checkFilterIds;
