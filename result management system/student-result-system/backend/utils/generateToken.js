const jwt = require("jsonwebtoken");

const generateToken = (user) =>
  jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET || "dev-result-management-secret",
    { expiresIn: "1d" }
  );

module.exports = generateToken;
