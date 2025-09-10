// User schema
// - Roles: super_admin, admin, agent
// - Stores password hash only; never the plaintext password
const mongoose = require('mongoose');

const roles = ['super_admin', 'admin', 'agent'];

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true }, // unique user id
    name: { type: String, trim: true }, // display name
    role: { type: String, enum: roles, required: true, default: 'agent', index: true }, // authorization role
    password_hash: { type: String, required: true }, // scrypt hash
    status: { type: String, enum: ['active', 'disabled'], default: 'active', index: true }, // soft disable
    last_login_at: { type: Date } // last successful login timestamp
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
