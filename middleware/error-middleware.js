const ResponseError = require("../utils/response-error");
const statuscode = require("../utils/statuscode");

const error = async (e, req, res, next) => {
  if (e instanceof ResponseError) {
    res
      .status(e.status)
      .json({
        message: e.message,
        data: null,
        error: true,
      })
      .end();
  } else {
    res
      .status(statuscode.InternakError)
      .json({
        message: e.message,
        data: null,
        error: true,
      })
      .end();
  }
};

module.exports = error;
