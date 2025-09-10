// User controller for admin operations (list/get/create)
const createError = require('http-errors');
const { createUser, findByEmail } = require('../services/user.service');
const User = require('../models/user.model');

/** Paginated list of users (password hashes omitted) */
async function list(req, res, next) {
  try {
    const { page, limit, q } = req.query;
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

/** Return a single user by id (password hash omitted) */
async function getOne(req, res, next) {
  try {
    const user = await User.findById(req.params.id, { password_hash: 0 }).lean();
    if (!user) return next(createError(404, 'User not found'));
    res.json(user);
  } catch (err) {
    next(err);
  }
}

/** Create a user; admins can only create agents, super_admin can set any role */
async function create(req, res, next) {
  try {
    const actor = req.user;
    if (!actor) throw createError(401, 'Unauthorized');
    if (!['super_admin', 'admin'].includes(actor.role)) throw createError(403, 'Forbidden');
    const value = req.body;

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
