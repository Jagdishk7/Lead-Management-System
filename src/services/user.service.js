const User = require('../models/user.model');
const { hashPassword } = require('../utils/password');

async function findByEmail(email) {
  return User.findOne({ email: email.toLowerCase() }).lean();
}

async function findById(id) {
  return User.findById(id).lean();
}

async function recordLogin(userId) {
  return User.updateOne({ _id: userId }, { $set: { last_login_at: new Date() } });
}

async function createUser({ email, name, role = 'agent', password }) {
  const password_hash = hashPassword(password);
  const doc = await User.create({ email: email.toLowerCase(), name, role, password_hash });
  return doc.toObject();
}

module.exports = { findByEmail, findById, recordLogin, createUser };
