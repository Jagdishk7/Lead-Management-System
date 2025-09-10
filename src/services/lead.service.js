// Lead-related data operations used by controllers
const Lead = require('../models/lead.model');

/** Persist a new lead document */
async function createLead(payload) {
  const lead = await Lead.create(payload);
  return lead.toObject();
}

/** Paginated lead listing with optional text query over common fields */
async function listLeads({ page = 1, limit = 20, q }) {
  const filter = {};
  if (q) {
    const regex = new RegExp(q, 'i');
    Object.assign(filter, { $or: [{ first_name: regex }, { last_name: regex }, { email: regex }, { phone: regex }] });
  }

    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
        Lead.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
        Lead.countDocuments(filter)
    ]);

    return { items, total, page, pages: Math.ceil(total / limit) };
}

/** Fetch a single lead by id */
async function getLeadById(id) {
  const lead = await Lead.findById(id).lean();
  return lead;
}

module.exports = { createLead, listLeads, getLeadById };
