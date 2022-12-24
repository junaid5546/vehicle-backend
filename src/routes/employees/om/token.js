const User = require("../../../model/employees/om/users_employees");
const jwt = require("jsonwebtoken");

const tokenVerify = (req, res, next) => {
  try {
    const REACT_APP_TOKEN_SECRET =
      "blalalalalalalallaalallaalallalalalalalalalalalalalaallalalalalalalalallalalalalalalal";
    const token = req?.header("auth-token");
    if (!token) return res.status(401).send("Access Denide");
    const verified = jwt.verify(token, REACT_APP_TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(401).send("Invalid Token");
  }
};

module.exports.tokenVerify = tokenVerify;
