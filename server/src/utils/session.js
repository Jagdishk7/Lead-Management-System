// JWT helpers for access and refresh tokens stored in HttpOnly cookies
// - Access: short-lived, used for auth on API requests
// - Refresh: longer-lived, used only at /auth/refresh to rotate tokens
const jwt = require('jsonwebtoken');

function requiredEnv(name) {
  const v = process.env[name];
  if (!v) throw new Error(`${name} is not set`);
  return v;
}

function seconds(name, def) {
  const v = parseInt(process.env[name] || `${def}`, 10);
  return Number.isFinite(v) ? v : def;
}

// Token lifetimes (seconds)
const ACCESS_TOKEN_TTL = seconds('ACCESS_TOKEN_TTL_SECONDS', 900); // 15m
const REFRESH_TOKEN_TTL = seconds('REFRESH_TOKEN_TTL_SECONDS', 1209600); // 14d

/** Create a short-lived access token with minimal claims */
function issueAccessToken({ sub, role, email }) {
  const secret = requiredEnv('ACCESS_TOKEN_SECRET');
  const payload = { sub, role, email };
  return jwt.sign(payload, secret, { expiresIn: ACCESS_TOKEN_TTL });
}

/** Create a refresh token; includes a type guard to avoid misuse */
function issueRefreshToken({ sub, role }) {
  const secret = requiredEnv('REFRESH_TOKEN_SECRET');
  const payload = { sub, role, type: 'refresh' };
  return jwt.sign(payload, secret, { expiresIn: REFRESH_TOKEN_TTL });
}

/** Verify access token; returns payload or null */
function verifyAccess(token) {
  try {
    const secret = requiredEnv('ACCESS_TOKEN_SECRET');
    return jwt.verify(token, secret);
  } catch (_) {
    return null;
  }
}

/** Verify refresh token and ensure its type is 'refresh' */
function verifyRefresh(token) {
  try {
    const secret = requiredEnv('REFRESH_TOKEN_SECRET');
    const payload = jwt.verify(token, secret);
    if (payload && payload.type === 'refresh') return payload;
    return null;
  } catch (_) {
    return null;
  }
}

module.exports = {
  issueAccessToken,
  issueRefreshToken,
  verifyAccess,
  verifyRefresh,
  ACCESS_TOKEN_TTL,
  REFRESH_TOKEN_TTL
};
