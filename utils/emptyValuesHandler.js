const emptyValueHandler = (val) => {
  if (val === null || val === undefined) {
    return "";
  } else {
    return val;
  }
};

module.exports.emptyValueHandler = emptyValueHandler;
