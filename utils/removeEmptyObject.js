const removeEmptyObject = (arr) => {
  return arr?.filter((element) => {
    if (Object.keys(element)?.length !== 0) {
      return true;
    }

    return false;
  });
};
module.exports.removeEmptyObject = removeEmptyObject;
