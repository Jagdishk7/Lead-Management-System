const createError = require('http-errors');
const {
  issueAccessToken,
  issueRefreshToken,
  verifyAccess,
  verifyRefresh,
  ACCESS_TOKEN_TTL,
  REFRESH_TOKEN_TTL
} = require('../utils/session');
const { findByEmail, findById, recordLogin } = require('../services/user.service');
const { verifyPassword } = require('../utils/password');

function accessCookieOptions() {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: !!(isProd || process.env.COOKIE_SECURE === 'true'),
    sameSite: process.env.COOKIE_SAMESITE || 'lax',
    path: '/',
    maxAge: ACCESS_TOKEN_TTL * 1000
  };
}

function refreshCookieOptions() {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: !!(isProd || process.env.COOKIE_SECURE === 'true'),
    sameSite: process.env.COOKIE_SAMESITE || 'lax',
    path: '/api/v1/auth/refresh',
    maxAge: REFRESH_TOKEN_TTL * 1000
  };
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) throw createError(400, 'Email and password are required');

    const user = await findByEmail(email);
    if (!user || user.status !== 'active') throw createError(401, 'Invalid credentials');
    const ok = verifyPassword(password, user.password_hash);
    if (!ok) throw createError(401, 'Invalid credentials');

    await recordLogin(user._id);

    const access = issueAccessToken({ sub: String(user._id), role: user.role, email: user.email });
    const refresh = issueRefreshToken({ sub: String(user._id), role: user.role });

    const accessName = process.env.ACCESS_COOKIE_NAME || 'access_token';
    const refreshName = process.env.REFRESH_COOKIE_NAME || 'refresh_token';
    res.cookie(accessName, access, accessCookieOptions());
    res.cookie(refreshName, refresh, refreshCookieOptions());
    res.json({ user: { email: user.email, role: user.role, name: user.name || null } });
  } catch (err) {
    next(err);
  }
}

function logout(req, res) {
  const accessName = process.env.ACCESS_COOKIE_NAME || 'access_token';
  const refreshName = process.env.REFRESH_COOKIE_NAME || 'refresh_token';
  res.cookie(accessName, '', { ...accessCookieOptions(), maxAge: 0 });
  res.cookie(refreshName, '', { ...refreshCookieOptions(), maxAge: 0 });
  res.status(204).send();
}

function me(req, res) {
  const name = process.env.ACCESS_COOKIE_NAME || 'access_token';
  const token = (req.headers.cookie || '').split(';').find(c => c.trim().startsWith(name + '='));
  if (!token) return res.status(200).json({ user: null });
  const value = decodeURIComponent(token.split('=')[1]);
  const payload = verifyAccess(value);
  if (!payload) return res.status(200).json({ user: null });
  res.json({ user: { email: payload.email || null, role: payload.role } });
}

async function refresh(req, res, next) {
  try {
    const name = process.env.REFRESH_COOKIE_NAME || 'refresh_token';
    const token = (req.headers.cookie || '').split(';').find(c => c.trim().startsWith(name + '='));
    if (!token) throw createError(401, 'Unauthorized');
    const value = decodeURIComponent(token.split('=')[1]);
    const payload = verifyRefresh(value);
    if (!payload) throw createError(401, 'Unauthorized');

    const user = await findById(payload.sub);
    if (!user || user.status !== 'active') throw createError(401, 'Unauthorized');

    const access = issueAccessToken({ sub: String(user._id), role: user.role, email: user.email });
    const refresh = issueRefreshToken({ sub: String(user._id), role: user.role });

    const accessName = process.env.ACCESS_COOKIE_NAME || 'access_token';
    const refreshName = process.env.REFRESH_COOKIE_NAME || 'refresh_token';
    res.cookie(accessName, access, accessCookieOptions());
    res.cookie(refreshName, refresh, refreshCookieOptions());
    res.json({ user: { email: user.email, role: user.role, name: user.name || null } });
  } catch (err) {
    next(err);
  }
}

module.exports = { login, logout, me, refresh };
