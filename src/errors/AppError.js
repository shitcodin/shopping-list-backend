class AppError extends Error {
  constructor({ code, message, status = 400, type = 'error', paramMap = {}, uuAppErrorMap = {} }) {
    super(message);
    this.code = code;
    this.status = status;
    this.type = type;
    this.paramMap = paramMap;
    this.uuAppErrorMap = uuAppErrorMap;
  }
}

module.exports = AppError;
