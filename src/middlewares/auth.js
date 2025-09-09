const cookie = require('cookie');
const createError = require('http-errors');
const { verifyAccess } = require('../utils/session');

function getCookie(req, name) {
  const header = req.headers.cookie || '';
  const parsed = cookie.parse(header);
  return parsed[name];
}

function requireAuth(req, res, next) {
  try {
    // Prefer Authorization header Bearer token if present
    const auth = req.headers.authorization || '';
    let token = null;
    if (auth.toLowerCase().startsWith('bearer ')) {
      token = auth.slice(7);
    } else {
      token = getCookie(req, process.env.ACCESS_COOKIE_NAME || 'access_token');
    }
    const payload = verifyAccess(token);
    if (!payload) return next(createError(401, 'Unauthorized'));
    req.user = { id: payload.sub, role: payload.role, email: payload.email };
    return next();
  } catch (err) {
    return next(createError(401, 'Unauthorized'));
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return next(createError(401, 'Unauthorized'));
    if (!roles.includes(req.user.role)) return next(createError(403, 'Forbidden'));
    next();
  };
}

module.exports = { requireAuth, requireRole };
