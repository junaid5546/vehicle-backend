const { uniqueFileFilter } = require("./fileFilter");
var parser = new (require("simple-excel-to-json").XlsParser)();

const uploadJSONXlx = (path, key) => {
  const data = parser.parseXls2Json(path)[0];
  const response = uniqueFileFilter(data, (e) => e[key]);
  return response;
};

module.exports.uploadJSONXlx = uploadJSONXlx;
