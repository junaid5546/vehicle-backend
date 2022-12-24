const emptyValueRemover = (body) => {
  const objectArray = Object.entries(body);
  const keys = Object.keys(body);
  let bodyArray = [];
  objectArray.forEach(([key, value]) => {
    bodyArray.push({ [key]: value });
  });
  let obj = {};
  bodyArray.filter((element) => {
    keys.map((key) => {
      element[key]?.length > 0 ? (obj[key] = element[key]) : "";
    });
  });

  return obj;
};

module.exports.emptyValueRemover = emptyValueRemover;
