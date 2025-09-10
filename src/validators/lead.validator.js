const Joi = require('joi');

const phoneRegex = /^[0-9\-+()\s]{7,20}$/;
const digits = /^\d+$/;

const createLeadSchema = Joi.object({
    state: Joi.string().max(64).allow('', null),
    first_name: Joi.string().max(100).required(),
    last_name: Joi.string().max(100).required(),
    address: Joi.string().max(200).allow('', null),
    city: Joi.string().max(100).allow('', null),
    email: Joi.string().email().allow('', null),
    zip: Joi.string().max(10).allow('', null),
    dob: Joi.string().max(20).allow('', null),
    dob_month: Joi.string().pattern(digits).min(1).max(2).allow('', null),
    dob_day: Joi.string().pattern(digits).min(1).max(2).allow('', null),
    dob_year: Joi.string().pattern(digits).min(4).max(4).allow('', null),
    ssn: Joi.string().pattern(digits).min(4).max(11).allow('', null),
    ssn_1: Joi.string().pattern(digits).min(3).max(3).allow('', null),
    ssn_2: Joi.string().pattern(digits).min(2).max(2).allow('', null),
    ssn_3: Joi.string().pattern(digits).min(4).max(4).allow('', null),
    license_number: Joi.string().max(50).allow('', null),
    license_state: Joi.string().max(64).allow('', null),
    employer_name: Joi.string().max(120).allow('', null),
    job_title: Joi.string().max(120).allow('', null),
    phone: Joi.string().pattern(phoneRegex).allow('', null),
    employer_phone: Joi.string().pattern(phoneRegex).allow('', null),
    bank_name: Joi.string().max(120).allow('', null),
    routing_number: Joi.string().pattern(digits).min(9).max(9).allow('', null),
    account_number: Joi.string().pattern(digits).min(4).max(20).allow('', null)
});

const listLeadsQuerySchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(200).default(20),
    q: Joi.string().max(200).allow('', null)
});

const idParamSchema = Joi.object({
    id: Joi.string().hex().length(24).required()
});

module.exports = { createLeadSchema, listLeadsQuerySchema, idParamSchema };
