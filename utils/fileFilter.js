const uniqueFileFilter = (data, key) => {
  return [...new Map(data.map((x) => [key(x), x])).values()];
};

module.exports.uniqueFileFilter = uniqueFileFilter;
