const bcrypt = require("bcryptjs");
const User = require("../models/User");

const defaultUsers = {
  admin: {
    name: process.env.DEFAULT_ADMIN_NAME || "System Administrator",
    email: process.env.DEFAULT_ADMIN_EMAIL || "admin@campus.edu",
    password: process.env.DEFAULT_ADMIN_PASSWORD || "Admin@123",
    role: "admin",
  },
  faculty: {
    name: process.env.DEFAULT_FACULTY_NAME || "Faculty Coordinator",
    email: process.env.DEFAULT_FACULTY_EMAIL || "faculty@campus.edu",
    password: process.env.DEFAULT_FACULTY_PASSWORD || "Faculty@123",
    role: "faculty",
  },
};

const seedUser = async ({ name, email, password, role }) => {
  if (!email || !password) {
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.findOneAndUpdate(
    { email },
    {
      name,
      email,
      password: hashedPassword,
      role,
      isActive: true,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
};

const seedDefaultUsers = async () => {
  await seedUser(defaultUsers.admin);
  await seedUser(defaultUsers.faculty);
};

module.exports = { seedDefaultUsers };
