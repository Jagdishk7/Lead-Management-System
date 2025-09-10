const Joi = require('joi');

const listUsersQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(200).default(20),
  q: Joi.string().max(200).allow('', null)
});

const createUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(128).required(),
  name: Joi.string().max(120).allow('', null),
  role: Joi.string().valid('super_admin', 'admin', 'agent').optional()
});

const idParamSchema = Joi.object({
  id: Joi.string().hex().length(24).required()
});

module.exports = {
  listUsersQuerySchema,
  createUserSchema,
  idParamSchema
};

