const AppError = require('../errors/AppError');
const { addWarning } = require('./uuAppErrorMap');

function buildJoiValidationDetails(error) {
  const invalidTypeKeyMap = {};
  const invalidValueKeyMap = {};
  const missingKeyMap = {};

  if (!error || !error.details) {
    return { invalidTypeKeyMap, invalidValueKeyMap, missingKeyMap };
  }

  for (const detail of error.details) {
    const key = detail.path.join('.') || detail.context?.label;
    if (detail.type.includes('required')) {
      missingKeyMap[key] = detail.message;
    } else if (detail.type.includes('base')) {
      invalidTypeKeyMap[key] = detail.message;
    } else {
      invalidValueKeyMap[key] = detail.message;
    }
  }

  return { invalidTypeKeyMap, invalidValueKeyMap, missingKeyMap };
}

function findUnsupportedKeys(dtoIn = {}, allowedKeys = []) {
  if (!Array.isArray(allowedKeys) || allowedKeys.length === 0) {
    return [];
  }
  return Object.keys(dtoIn).filter((key) => !allowedKeys.includes(key));
}

function validateDtoIn(dtoIn, schema, options = {}) {
  const { allowedKeys = [], abortEarly = false, uuAppErrorMap = {} } = options;
  const normalizedDtoIn = dtoIn || {};
  const map = uuAppErrorMap;

  const unsupportedKeys = findUnsupportedKeys(normalizedDtoIn, allowedKeys);
  if (unsupportedKeys.length) {
    addWarning(map, 'unsupportedKeys', 'DtoIn contains unsupported keys.', {
      unsupportedKeyList: unsupportedKeys,
    });
  }

  const { value, error } = schema.validate(normalizedDtoIn, { allowUnknown: true, abortEarly });
  if (error) {
    throw new AppError({
      code: 'invalidDtoIn',
      message: 'DtoIn is not valid.',
      status: 400,
      paramMap: buildJoiValidationDetails(error),
      uuAppErrorMap: map,
    });
  }

  return { value, uuAppErrorMap: map };
}

module.exports = validateDtoIn;
module.exports.buildJoiValidationDetails = buildJoiValidationDetails;
