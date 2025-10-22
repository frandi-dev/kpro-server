class ResponseError extends Error {
  constructor(status, message) {
    super(status);
    this.status = status;
  }
}

module.exports = ResponseError;
