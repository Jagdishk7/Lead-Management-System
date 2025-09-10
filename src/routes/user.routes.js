// User management routes (admin area)
// - Only super_admin and admin can list/get/create users
const router = require('express').Router();
const { list, getOne, create } = require('../controllers/user.controller');
const { requireAuth, requireRole } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { listUsersQuerySchema, createUserSchema, idParamSchema } = require('../validators/user.validator');

// Admin area: list and manage users
router.get('/', requireAuth, requireRole('super_admin', 'admin'), validate.validateQuery(listUsersQuerySchema), list);
router.get('/:id', requireAuth, requireRole('super_admin', 'admin'), validate.validateParams(idParamSchema), getOne);
router.post('/', requireAuth, requireRole('super_admin', 'admin'), validate.validateBody(createUserSchema), create);

module.exports = router;
