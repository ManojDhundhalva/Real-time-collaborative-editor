const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = (req, resp, next) => {
  const authHeader = req.headers.Authorization;

  if (!authHeader) {
    return resp.status(404).json({ message: "You are not authenticated!" });
  }

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      return resp.status(403).json({ message: "Token is not valid!" });
    }
    req.user = user;
    next();
  });
};

const verifyTokenAndAuthorization = (req, resp, next) => {
  verifyToken(req, resp, () => {
    if (String(req.user.username) === String(req.query.username)) {
      next();
    } else {
      resp.status(404).json({ message: "You are not allowed to do that!" });
    }
  });
};

module.exports = {
  verifyTokenAndAuthorization,
  verifyToken,
};
