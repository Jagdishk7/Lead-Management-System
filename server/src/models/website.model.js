// Website model
// Central registry for owned websites and landing pages
// Fields use snake_case to match existing code style
const mongoose = require('mongoose');

const WEBSITE_TYPES = ['website', 'landing_page'];
const STATUSES = ['active', 'inactive'];

const WebsiteSchema = new mongoose.Schema(
  {
    // Human-readable name
    name: { type: String, required: true, trim: true },

    // Stable machine key for frontend/backend matching (e.g., 'zippy_cash')
    code: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: /^[a-z0-9_]+$/,
      index: true,
      unique: true
    },

    // 'website' for full sites, 'landing_page' for specific LPs
    type: { type: String, enum: WEBSITE_TYPES, required: true, index: true },

    // Primary domain (optional for some landing pages); kept lowercase
    domain: { type: String, trim: true, lowercase: true },

    // Optional canonical/base URL for linking in UI
    base_url: { type: String, trim: true },

    // Optional alternate codes for backward-compatible matching
    aliases: { type: [String], default: [], select: false },

    // Operational status
    status: { type: String, enum: STATUSES, default: 'active', index: true },

    // Free-form per-site configuration
    settings: { type: mongoose.Schema.Types.Mixed }
  },
  { timestamps: true }
);

// Ensure domain uniqueness only when provided
WebsiteSchema.index(
  { domain: 1 },
  { unique: true, partialFilterExpression: { domain: { $type: 'string' } } }
);

// Helpful compound index for common filters
WebsiteSchema.index({ type: 1, status: 1 });

// Normalize array values
WebsiteSchema.pre('save', function (next) {
  if (Array.isArray(this.aliases)) {
    this.aliases = this.aliases
      .filter(Boolean)
      .map((s) => String(s).trim().toLowerCase());
  }
  next();
});

module.exports = mongoose.model('Website', WebsiteSchema);

