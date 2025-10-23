const jwt = require("jsonwebtoken");
const ResponseError = require("../utils/response-error");
const statuscode = require("../utils/statuscode");

// cek token
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

// cek role acces
const authrole = (roles = ["admin,cashier", "waiter"]) => {
  return (req, res, next) => {
    try {
      if (!roles.includes(req.user.role)) {
        throw new ResponseError(statuscode.Forbidden, "Access denied'");
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = { authorization, authrole };
