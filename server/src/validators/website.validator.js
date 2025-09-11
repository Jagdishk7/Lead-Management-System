const Joi = require('joi');

const codePattern = /^[a-z0-9_]+$/;
const WEBSITE_TYPES = ['website', 'landing_page'];
const STATUSES = ['active', 'inactive'];

const createWebsiteSchema = Joi.object({
  name: Joi.string().min(2).max(120).required(),
  code: Joi.string().lowercase().pattern(codePattern).min(2).max(50).required(),
  type: Joi.string().valid(...WEBSITE_TYPES).required(),
  domain: Joi.string().trim().allow('', null),
  base_url: Joi.string().trim().allow('', null),
  aliases: Joi.array().items(Joi.string().lowercase().pattern(codePattern)).default([]),
  status: Joi.string().valid(...STATUSES).default('active'),
  settings: Joi.object().unknown(true).optional()
});

const updateWebsiteSchema = Joi.object({
  name: Joi.string().min(2).max(120),
  code: Joi.string().lowercase().pattern(codePattern).min(2).max(50),
  type: Joi.string().valid(...WEBSITE_TYPES),
  domain: Joi.string().trim().allow('', null),
  base_url: Joi.string().trim().allow('', null),
  aliases: Joi.array().items(Joi.string().lowercase().pattern(codePattern)),
  status: Joi.string().valid(...STATUSES),
  settings: Joi.object().unknown(true)
}).min(1);

const listWebsitesQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(200).default(20),
  q: Joi.string().max(200).allow('', null),
  type: Joi.string().valid(...WEBSITE_TYPES).allow('', null),
  status: Joi.string().valid(...STATUSES).allow('', null)
});

const idParamSchema = Joi.object({ id: Joi.string().hex().length(24).required() });

module.exports = { createWebsiteSchema, updateWebsiteSchema, listWebsitesQuerySchema, idParamSchema };

