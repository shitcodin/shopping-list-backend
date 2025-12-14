const Joi = require('joi');

const schema = Joi.object({
  userId: Joi.string().trim().min(1).required(),
  role: Joi.string().valid('Authorities', 'Users').required(),
});

const allowedKeys = ['userId', 'role'];

module.exports = {
  schema,
  allowedKeys,
};
