const router = require('express').Router();
const { create, list, getOne } = require('../controllers/lead.controller');
const { requireAuth, requireRole } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { createLeadSchema } = require('../validators/lead.validator');

// router.post('/', validate(createLeadSchema), create);
router.post('/', create);
router.get('/', requireAuth, requireRole('admin', 'super_admin'), list);
router.get('/:id', requireAuth, requireRole('admin', 'super_admin'), getOne);

module.exports = router;
