const { addError } = require('../utils/uuAppErrorMap');

function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const uuAppErrorMap = err.uuAppErrorMap ? { ...err.uuAppErrorMap } : {};

  if (err.code) {
    addError(uuAppErrorMap, err.code, err.message || 'Unexpected error.', err.paramMap || {});
  } else if (status >= 500) {
    addError(uuAppErrorMap, 'internalServerError', 'Unexpected server error.', {});
  }

  if (status >= 500 && !err.code) {
    // eslint-disable-next-line no-console
    console.error(err);
  }

  res.status(status).json({
    data: err.data || null,
    uuAppErrorMap,
  });
}

function notFoundHandler(req, res) {
  const uuAppErrorMap = {};
  addError(uuAppErrorMap, 'notFound', 'The requested resource was not found.', {
    method: req.method,
    url: req.originalUrl,
  });

  res.status(404).json({ data: null, uuAppErrorMap });
}

module.exports = {
  errorHandler,
  notFoundHandler,
};
