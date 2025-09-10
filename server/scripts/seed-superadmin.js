require('dotenv').config();
const { connectDB } = require('../src/config/db');
const { createUser } = require('../src/services/user.service');

(async () => {
  try {
    await connectDB();
    const email = process.env.SEED_SUPERADMIN_EMAIL;
    const password = process.env.SEED_SUPERADMIN_PASSWORD;
    const name = process.env.SEED_SUPERADMIN_NAME || 'Super Admin';
    if (!email || !password) throw new Error('Set SEED_SUPERADMIN_EMAIL and SEED_SUPERADMIN_PASSWORD');
    const user = await createUser({ email, name, role: 'super_admin', password });
    console.log('Seeded super admin:', { id: user._id, email: user.email, role: user.role });
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err.message);
    process.exit(1);
  }
})();

