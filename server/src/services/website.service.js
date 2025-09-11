const Website = require('../models/website.model');

async function createWebsite(payload) {
  const doc = await Website.create(payload);
  return doc.toObject();
}

async function listWebsites({ page = 1, limit = 20, q, type, status }) {
  const filter = {};
  if (q) {
    const regex = new RegExp(q, 'i');
    Object.assign(filter, { $or: [{ name: regex }, { code: regex }, { domain: regex }] });
  }
  if (type) filter.type = type;
  if (status) filter.status = status;

  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Website.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Website.countDocuments(filter)
  ]);
  return { items, total, page, pages: Math.ceil(total / limit) };
}

async function getWebsiteById(id) {
  return Website.findById(id).lean();
}

async function updateWebsite(id, payload) {
  const updated = await Website.findByIdAndUpdate(id, payload, { new: true, runValidators: true }).lean();
  return updated;
}

async function softDeleteWebsite(id) {
  const updated = await Website.findByIdAndUpdate(id, { status: 'inactive' }, { new: true }).lean();
  return updated;
}

async function hardDeleteWebsite(id) {
  await Website.deleteOne({ _id: id });
  return { ok: true };
}

module.exports = { createWebsite, listWebsites, getWebsiteById, updateWebsite, softDeleteWebsite, hardDeleteWebsite };

