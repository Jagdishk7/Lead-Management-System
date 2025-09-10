// Lead controller: thin layer calling the lead service
const { createLead, listLeads, getLeadById } = require('../services/lead.service');

/** Create a new lead from landing page payload */
async function create(req, res, next) {
    try {
        const lead = await createLead(req.body);
        res.status(201).json(lead);
    } catch (err) {
        next(err);
    }
}

/** Return paginated leads (admin area) */
async function list(req, res, next) {
    try {
        const page = parseInt(req.query.page || '1', 10);
        const limit = Math.min(parseInt(req.query.limit || '20', 10), 200);
        const q = req.query.q;
        const data = await listLeads({ page, limit, q });
        res.json(data);
    } catch (err) {
        next(err);
    }
}

/** Get a single lead by id */
async function getOne(req, res, next) {
    try {
        const lead = await getLeadById(req.params.id);
        if (!lead) return res.status(404).json({ message: 'Lead not found' });
        res.json(lead);
    } catch (err) {
        next(err);
    }
}

module.exports = { create, list, getOne };
