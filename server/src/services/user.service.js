// User-related data access helpers
const User = require('../models/user.model');
const { hashPassword } = require('../utils/password');

/** Find a user by email (case-insensitive) */
async function findByEmail(email) {
  return User.findOne({ email: email.toLowerCase() }).lean();
}

/** Find a user by id */
async function findById(id) {
  return User.findById(id).lean();
}

/** Update the user's last login timestamp */
async function recordLogin(userId) {
  return User.updateOne({ _id: userId }, { $set: { last_login_at: new Date() } });
}

/** Create a new user with a securely hashed password */
async function createUser({ email, name, role = 'agent', password }) {
  const password_hash = hashPassword(password);
  const doc = await User.create({ email: email.toLowerCase(), name, role, password_hash });
  return doc.toObject();
}

module.exports = { findByEmail, findById, recordLogin, createUser };
