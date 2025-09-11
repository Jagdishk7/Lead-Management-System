const createError = require('http-errors');
const { createWebsite, listWebsites, getWebsiteById, updateWebsite, softDeleteWebsite, hardDeleteWebsite } = require('../services/website.service');

async function create(req, res, next) {
  try {
    const site = await createWebsite(req.body);
    res.status(201).json(site);
  } catch (err) {
    if (err?.code === 11000) {
      const fields = Object.keys(err.keyPattern || {});
      return next(createError(409, `Duplicate ${fields.join(', ')}`));
    }
    next(err);
  }
}

async function list(req, res, next) {
  try {
    const page = parseInt(req.query.page || '1', 10);
    const limit = Math.min(parseInt(req.query.limit || '20', 10), 200);
    const { q, type, status } = req.query;
    const data = await listWebsites({ page, limit, q, type, status });
    res.json(data);
  } catch (err) { next(err); }
}

async function getOne(req, res, next) {
  try {
    const site = await getWebsiteById(req.params.id);
    if (!site) return res.status(404).json({ message: 'Website not found' });
    res.json(site);
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const site = await updateWebsite(req.params.id, req.body);
    if (!site) return res.status(404).json({ message: 'Website not found' });
    res.json(site);
  } catch (err) {
    if (err?.code === 11000) {
      const fields = Object.keys(err.keyPattern || {});
      return next(createError(409, `Duplicate ${fields.join(', ')}`));
    }
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const hard = String(req.query.hard || 'false') === 'true';
    if (hard) {
      await hardDeleteWebsite(req.params.id);
      return res.status(204).send();
    }
    const site = await softDeleteWebsite(req.params.id);
    if (!site) return res.status(404).json({ message: 'Website not found' });
    res.json(site);
  } catch (err) { next(err); }
}

module.exports = { create, list, getOne, update, remove };

