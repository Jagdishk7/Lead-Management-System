const crypto = require('crypto');

// scrypt password hashing helpers (no external deps)

const N = 16384; // CPU/memory cost
const r = 8;     // block size
const p = 1;     // parallelization
const keylen = 64;

function toB64(buf) { return Buffer.from(buf).toString('base64'); }
function fromB64(str) { return Buffer.from(str, 'base64'); }

function hashPassword(password) {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(password, salt, keylen, { N, r, p });
  return `scrypt$N=${N}$r=${r}$p=${p}$${toB64(salt)}$${toB64(hash)}`;
}

function verifyPassword(password, stored) {
  try {
    const parts = stored.split('$');
    if (parts.length !== 6 || parts[0] !== 'scrypt') return false;
    const Npart = parseInt(parts[1].split('=')[1], 10);
    const rpart = parseInt(parts[2].split('=')[1], 10);
    const ppart = parseInt(parts[3].split('=')[1], 10);
    const salt = fromB64(parts[4]);
    const expected = fromB64(parts[5]);
    const hash = crypto.scryptSync(password, salt, expected.length, { N: Npart, r: rpart, p: ppart });
    return crypto.timingSafeEqual(hash, expected);
  } catch (_) {
    return false;
  }
}

module.exports = { hashPassword, verifyPassword };

