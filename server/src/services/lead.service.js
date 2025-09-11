const createError = require('http-errors');
const Lead = require('../models/lead.model');
const Website = require('../models/website.model');

/**
 * Create a lead. Resolves website by id or code and snapshots key fields.
 */
async function createLead(payload) {
  let website = null;
  if (payload.website_id) {
    website = await Website.findById(payload.website_id).lean();
  } else if (payload.website_code) {
    website = await Website.findOne({ code: String(payload.website_code).toLowerCase() }).lean();
  }
  if (!website) throw createError(400, 'Invalid website reference');

  const doc = {
    ...payload,
    website_id: website._id,
    website_name: website.name,
    website_code: website.code,
    website_domain: website.domain || null,
    website_type: website.type,
    sitename: payload.sitename || website.name,
  };
  delete doc.website_code;

  const lead = await Lead.create(doc);
  return lead.toObject();
}

/**
 * List leads with optional q/website filters and date or range filters.
 */
async function listLeads({ page = 1, limit = 20, q, website_id, website_code, website_type, date, created_from, created_to }) {
  const filter = {};
  if (q) {
    const regex = new RegExp(q, 'i');
    Object.assign(filter, { $or: [{ first_name: regex }, { last_name: regex }, { email: regex }, { phone: regex }] });
  }
  if (website_id) filter.website_id = website_id;
  if (website_code) filter.website_code = String(website_code).toLowerCase();
  if (website_type) filter.website_type = website_type;

  if (date) {
    const d = new Date(date);
    const start = new Date(d); start.setUTCHours(0, 0, 0, 0);
    const end = new Date(d); end.setUTCHours(23, 59, 59, 999);
    filter.createdAt = { $gte: start, $lte: end };
  } else {
    const range = {};
    if (created_from) {
      const from = new Date(created_from);
      if (!isNaN(+from)) range.$gte = from;
    }
    if (created_to) {
      const to = new Date(created_to);
      if (!isNaN(+to)) range.$lte = to;
    }
    if (range.$gte || range.$lte) filter.createdAt = range;
  }

  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Lead.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('website_id', 'name code type domain base_url status')
      .lean(),
    Lead.countDocuments(filter),
  ]);

  return { items, total, page, pages: Math.ceil(total / limit) };
}

/** Get one lead with website populated */
async function getLeadById(id) {
  return Lead.findById(id)
    .populate('website_id', 'name code type domain base_url status')
    .lean();
}

/** Update a lead and optionally its website association (by id/code) */
async function updateLead(id, payload) {
  const update = { ...payload };
  if (payload.website_id || payload.website_code) {
    let website = null;
    if (payload.website_id) {
      website = await Website.findById(payload.website_id).lean();
    } else if (payload.website_code) {
      website = await Website.findOne({ code: String(payload.website_code).toLowerCase() }).lean();
    }
    if (!website) throw createError(400, 'Invalid website reference');
    update.website_id = website._id;
    update.website_name = website.name;
    update.website_code = website.code;
    update.website_domain = website.domain || null;
    update.website_type = website.type;
    if (!update.sitename) update.sitename = website.name;
    delete update.website_code;
  }

  const updated = await Lead.findByIdAndUpdate(id, update, { new: true, runValidators: true })
    .populate('website_id', 'name code type domain base_url status')
    .lean();
  return updated; // could be null
}

/** Delete a lead */
async function deleteLead(id) {
  const res = await Lead.deleteOne({ _id: id });
  return res.deletedCount > 0;
}

module.exports = { createLead, listLeads, getLeadById, updateLead, deleteLead };

