const jwt = require("jsonwebtoken");
const Session = require("../model/users/authentication/session.model");
const userSchema = require("../model/users/authentication/user.model.js");
const dotenv = require("dotenv");
dotenv.config();

module.exports = (myParam) => {
  return async (req, res, next) => {
    const token = req.header("Authorization");
    const usertId = req.header("user-id");

    if (!token) return res.status(401).send("Access Denied");

    try {
      const verified = jwt.verify(token, process.env.TOKEN_SECRET);
      if (verified) {
        if (myParam != "public") {
          if (!usertId) return res.status(401).send("Access Denied");

          const session = await Session.findOne({ accessToken: token });
          if (!session) return res.status(401).send("Access Denied");

          const user = await userSchema.findById({ _id: session.userId });

          if (user.userStatus != "active" || user.forceLogout == true) {
            await Session.findOneAndDelete({ accessToken: token });
            return res.status(401).send("Access Denied");
          }
        }
      }

      req.user = verified;
      req.user_id = usertId;
      next();
    } catch (error) {
      res.status(400).send("Invalid token");
    }
  };
};
