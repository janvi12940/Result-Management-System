const express = require("express");
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const Student = require("../models/Student");
const { protect } = require("../middleware/authMiddleware");
const generateToken = require("../utils/generateToken");

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { identifier, password, role } = req.body;

    if (!identifier || !password || !role) {
      return res.status(400).json({ message: "Identifier, password, and role are required." });
    }

    const query =
      role === "student"
        ? { role, rollNumber: identifier.trim() }
        : { role, email: identifier.trim().toLowerCase() };

    const user = await User.findOne(query);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    let studentRecord = null;
    if (role === "student") {
      studentRecord = await Student.findOne({ user: user._id });
    }

    res.json({
      token: generateToken(user),
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        email: user.email || "",
        rollNumber: user.rollNumber || "",
      },
      hasResult: Boolean(studentRecord),
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Unable to complete login." });
  }
});

router.get("/me", protect, async (req, res) => {
  try {
    let studentRecord = null;
    if (req.user.role === "student") {
      studentRecord = await Student.findOne({ user: req.user._id });
    }

    res.json({
      user: req.user,
      hasResult: Boolean(studentRecord),
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Unable to fetch profile." });
  }
});

module.exports = router;
