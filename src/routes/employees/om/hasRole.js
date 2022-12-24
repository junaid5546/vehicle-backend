const hasRole = (role) => {
  return function (req, res, next) {
    if (req.user.role !== role)
      return res
        .status(401)
        .send(`Access Denide - Only ${role.toString()} can access`);
    next();
  };
};

module.exports.hasRole = hasRole;
