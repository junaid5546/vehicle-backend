var fs = require("fs");

function deleteFiles(files, filePath, callback) {
  var i = files.length;
  const fPath = filePath;
  files.forEach(function (filepath) {
    fs.unlink(`${fPath}/${filepath}`, function (err) {
      i--;
      if (err) {
        callback(err);
        return;
      } else if (i <= 0) {
        callback(null);
      }
    });
  });
}

module.exports.deleteFiles = deleteFiles;
