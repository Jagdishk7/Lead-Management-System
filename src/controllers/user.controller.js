const createError = require('http-errors');
const Joi = require('joi');
const { createUser, findByEmail } = require('../services/user.service');
const User = require('../models/user.model');

const listQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(200).default(20),
  q: Joi.string().max(200).allow('', null)
});

const createSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(128).required(),
  name: Joi.string().max(120).allow('', null),
  role: Joi.string().valid('super_admin', 'admin', 'agent').optional()
});

async function list(req, res, next) {
  try {
    const { value, error } = listQuerySchema.validate(req.query, { abortEarly: false, stripUnknown: true });
    if (error) throw createError(400, { message: 'Validation error', details: error.details });
    const { page, limit, q } = value;
    const filter = {};
    if (q) {
      const regex = new RegExp(q, 'i');
      Object.assign(filter, { $or: [{ email: regex }, { name: regex }] });
    }
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      User.find(filter, { password_hash: 0 })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(filter)
    ]);
    res.json({ items, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
}

async function getOne(req, res, next) {
  try {
    const user = await User.findById(req.params.id, { password_hash: 0 }).lean();
    if (!user) return next(createError(404, 'User not found'));
    res.json(user);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const actor = req.user;
    if (!actor) throw createError(401, 'Unauthorized');
    if (!['super_admin', 'admin'].includes(actor.role)) throw createError(403, 'Forbidden');

    const { error, value } = createSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) throw createError(400, { message: 'Validation error', details: error.details });

    // Only super_admin can set arbitrary roles; admins create agents
    let role = 'agent';
    if (value.role && actor.role === 'super_admin') role = value.role;
    if (actor.role === 'admin') role = 'agent';

    const existing = await findByEmail(value.email);
    if (existing) throw createError(409, 'Email already in use');

    const user = await createUser({ email: value.email, name: value.name, role, password: value.password });
    res.status(201).json({ id: user._id, email: user.email, role: user.role, name: user.name || null, status: user.status });
  } catch (err) {
    next(err);
  }
}

module.exports = { list, getOne, create };

