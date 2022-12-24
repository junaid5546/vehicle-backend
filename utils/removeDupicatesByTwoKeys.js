const removeDuplicate = (keys, data) => {
  return data?.filter(
    (
      (s) => (o) =>
        ((k) => !s.has(k) && s.add(k))(keys.map((k) => o[k]).join("|"))
    )(new Set())
  );
};

module.exports.removeDuplicate = removeDuplicate;
