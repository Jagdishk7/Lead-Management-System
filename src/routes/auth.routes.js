const router = require('express').Router();
const { login, logout, me, refresh } = require('../controllers/auth.controller');

router.post('/login', login);
router.post('/logout', logout);
router.get('/me', me);
router.post('/refresh', refresh);

module.exports = router;
