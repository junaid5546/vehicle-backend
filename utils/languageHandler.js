const { LANG } = require("../src/constants/vehicles_for_sale/postsConstants");

const langHandler = (arabic, eng, lang) => {
  if (lang === LANG.ARABIC) {
    return arabic;
  } else {
    return eng;
  }
};

module.exports.langHandler = langHandler;
