// Website CRUD routes (admin)
const router = require('express').Router();
const { requireAuth, requireRole } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { create, list, getOne, update, remove } = require('../controllers/website.controller');
const { createWebsiteSchema, updateWebsiteSchema, listWebsitesQuerySchema, idParamSchema } = require('../validators/website.validator');

// Full CRUD, restricted to admin/super_admin
router.get('/', requireAuth, requireRole('admin', 'super_admin'), validate.validateQuery(listWebsitesQuerySchema), list);
router.get('/:id', requireAuth, requireRole('admin', 'super_admin'), validate.validateParams(idParamSchema), getOne);
router.post('/', requireAuth, requireRole('admin', 'super_admin'), validate.validateBody(createWebsiteSchema), create);
router.patch('/:id', requireAuth, requireRole('admin', 'super_admin'), validate.validateParams(idParamSchema), validate.validateBody(updateWebsiteSchema), update);
router.delete('/:id', requireAuth, requireRole('admin', 'super_admin'), validate.validateParams(idParamSchema), remove);

module.exports = router;

