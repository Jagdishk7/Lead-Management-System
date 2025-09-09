const mongoose = require('mongoose');

const roles = ['super_admin', 'admin', 'agent'];

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    name: { type: String, trim: true },
    role: { type: String, enum: roles, required: true, default: 'agent', index: true },
    password_hash: { type: String, required: true },
    status: { type: String, enum: ['active', 'disabled'], default: 'active', index: true },
    last_login_at: { type: Date }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);

