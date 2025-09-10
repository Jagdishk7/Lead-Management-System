// Auth routes: cookie-based JWT access/refresh
const router = require('express').Router();
const { login, logout, me, refresh } = require('../controllers/auth.controller');
const validate = require('../middlewares/validate');
const { loginSchema } = require('../validators/auth.validator');

// Issue access/refresh cookies after verifying credentials
router.post('/login', validate.validateBody(loginSchema), login);
// Clear auth cookies
router.post('/logout', logout);
// Return current user (if any)
router.get('/me', me);
// Rotate tokens using refresh cookie
router.post('/refresh', refresh);

module.exports = router;
