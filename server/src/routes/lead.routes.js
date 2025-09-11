// Lead routes
// - POST is public for landing pages to submit leads
// - GET list/detail require admin or super_admin session
const router = require('express').Router();
const { create, list, getOne, update, remove } = require('../controllers/lead.controller');
const { requireAuth, requireRole } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { createLeadSchema, listLeadsQuerySchema, idParamSchema } = require('../validators/lead.validator');

// router.post('/', validate(createLeadSchema), create);
// Public endpoint to capture leads from landing pages
router.post('/', validate.validateBody(createLeadSchema), create);
// Admin-only endpoints to view leads
router.get('/', requireAuth, requireRole('admin', 'super_admin'), validate.validateQuery(listLeadsQuerySchema), list);
router.get('/:id', requireAuth, requireRole('admin', 'super_admin'), validate.validateParams(idParamSchema), getOne);
router.patch('/:id', requireAuth, requireRole('admin', 'super_admin'), validate.validateParams(idParamSchema), update);
router.delete('/:id', requireAuth, requireRole('admin', 'super_admin'), validate.validateParams(idParamSchema), remove);

module.exports = router;
