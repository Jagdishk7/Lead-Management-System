const router = require('express').Router();
const { list, getOne, create } = require('../controllers/user.controller');
const { requireAuth, requireRole } = require('../middlewares/auth');

// Admin area: list and manage users
router.get('/', requireAuth, requireRole('super_admin', 'admin'), list);
router.get('/:id', requireAuth, requireRole('super_admin', 'admin'), getOne);
router.post('/', requireAuth, requireRole('super_admin', 'admin'), create);

module.exports = router;

