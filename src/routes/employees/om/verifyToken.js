const jwt = require("jsonwebtoken");
module.exports = (myParam) => {
  try {
    return async (req, res, next) => {
      next();
    };
  } catch (error) {
    res.status(400).send("Invalid token");
  }
};
