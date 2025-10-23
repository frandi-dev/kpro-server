const jwt = require("jsonwebtoken");
const ResponseError = require("../utils/response-error");
const statuscode = require("../utils/statuscode");

const authorization = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header) {
    throw new ResponseError(statuscode.Unauthorized, "Unauthorized.");
  }

  const token = header.split(" ")[1];
  try {
    const verify = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verify;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { authorization };
