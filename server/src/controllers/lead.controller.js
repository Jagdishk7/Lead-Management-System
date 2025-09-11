const {
  createLead,
  listLeads,
  getLeadById,
  updateLead,
  deleteLead,
} = require("../services/lead.service");

async function create(req, res, next) {
  try {
    const lead = await createLead(req.body);
    res.status(201).json(lead);
  } catch (err) {
    next(err);
  }
}

async function list(req, res, next) {
  try {
    const page = parseInt(req.query.page || "1", 10);
    const limit = Math.min(parseInt(req.query.limit || "20", 10), 200);
    const q = req.query.q;
    const {
      website_id,
      website_code,
      website_type,
      date,
      created_from,
      created_to,
    } = req.query;
    const data = await listLeads({
      page,
      limit,
      q,
      website_id,
      website_code,
      website_type,
      date,
      created_from,
      created_to,
    });
    res.json(data);
  } catch (err) {
    next(err);
  }
}

async function getOne(req, res, next) {
  try {
    const lead = await getLeadById(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    res.json(lead);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const updated = await updateLead(req.params.id, req.body || {});
    if (!updated) return res.status(404).json({ message: "Lead not found" });
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const ok = await deleteLead(req.params.id);
    if (!ok) return res.status(404).json({ message: "Lead not found" });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { create, list, getOne, update, remove };
