const validateDtoIn = require('../../utils/validateDtoIn');
const { schema, allowedKeys } = require('./auth.validation');
const authService = require('./auth.service');

async function mockLogin(req, res, next) {
  try {
    const { value, uuAppErrorMap } = validateDtoIn(req.body, schema, {
      allowedKeys,
    });
    const token = authService.issueToken(value);
    res.status(200).json({
      data: { token },
      uuAppErrorMap,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  mockLogin,
};
