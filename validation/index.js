const ResponseError = require("../utils/response-error");
const statuscode = require("../utils/statuscode");

const validate = (scema, request) => {
  const result = scema.validate(request, {
    abortEarly: false,
    allowUnknown: false,
  });
  if (result.error) {
    throw new ResponseError(statuscode.BadRequest, result.error.message);
  } else {
    return result.value;
  }
};

module.exports = validate;
