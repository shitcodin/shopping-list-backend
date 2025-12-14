const Joi = require('joi');
const { isValidObjectId } = require('../../utils/objectId');

const objectIdSchema = Joi.string().custom((value, helpers) => {
  if (!isValidObjectId(value)) {
    return helpers.error('any.invalid');
  }
  return value;
}, 'objectId validation');

const schemas = {
  create: Joi.object({
    name: Joi.string().min(1).max(100).required(),
    items: Joi.array().items(Joi.string().trim().min(1)).default([]),
  }),
  list: Joi.object({
    pageIndex: Joi.number().integer().min(0).default(0),
    pageSize: Joi.number().integer().min(1).max(100).default(50),
  }),
  get: Joi.object({
    id: objectIdSchema.required(),
  }),
  update: Joi.object({
    id: objectIdSchema.required(),
    name: Joi.string().min(1).max(100),
    items: Joi.array().items(Joi.string().trim().min(1)),
  }).or('name', 'items'),
  delete: Joi.object({
    id: objectIdSchema.required(),
  }),
};

const allowedKeys = {
  create: ['name', 'items'],
  list: ['pageIndex', 'pageSize'],
  get: ['id'],
  update: ['id', 'name', 'items'],
  delete: ['id'],
};

module.exports = {
  schemas,
  allowedKeys,
};
