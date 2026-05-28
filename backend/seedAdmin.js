const mongoose = require('mongoose');
const dns = require('dns');

dns.setServers(['8.8.8.8', '8.8.4.4']);

require('dotenv').config();
const User = require('./src/users/user.model');

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';

async function main() {
  if (!process.env.DB_URL) {
    throw new Error('DB_URL is not set in .env');
  }

  await mongoose.connect(process.env.DB_URL);

  const existingAdmin = await User.findOne({ username: ADMIN_USERNAME, role: 'admin' });
  if (existingAdmin) {
    console.log(`Admin user already exists: ${ADMIN_USERNAME}`);
    process.exit(0);
  }

  const adminUser = new User({
    username: ADMIN_USERNAME,
    password: ADMIN_PASSWORD,
    role: 'admin',
  });

  await adminUser.save();
  console.log(`Admin user created successfully.`);
  console.log(`Username: ${ADMIN_USERNAME}`);
  console.log(`Password: ${ADMIN_PASSWORD}`);
  process.exit(0);
}

main().catch((error) => {
  console.error('Failed to create admin user:', error);
  process.exit(1);
});
