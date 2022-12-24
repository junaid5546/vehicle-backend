const checkDiscount = (total, discountPercentage) => {
  return total - (discountPercentage * total) / 100;
};

module.exports.checkDiscount = checkDiscount;
