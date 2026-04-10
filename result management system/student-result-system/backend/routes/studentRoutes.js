const express = require("express");
const bcrypt = require("bcryptjs");

const Student = require("../models/Student");
const User = require("../models/User");
const { protect, authorize } = require("../middleware/authMiddleware");
const { calculateResult, subjectKeys } = require("../utils/calculateResult");

const router = express.Router();

const parseMarks = (payload) => ({
  math: Number(payload.math),
  science: Number(payload.science),
  english: Number(payload.english),
  computer: Number(payload.computer),
});

const validatePayload = ({ name, rollNumber, department, semester, section, marks, password }) => {
  if (!name || !rollNumber || !department || !semester || !section) {
    return "All student profile fields are required.";
  }

  for (const subject of subjectKeys) {
    const value = Number(marks[subject]);
    if (Number.isNaN(value) || value < 0 || value > 100) {
      return `Invalid marks for ${subject}. Enter a value between 0 and 100.`;
    }
  }

  if (password && password.length < 6) {
    return "Password must be at least 6 characters long.";
  }

  return "";
};

router.get("/me", protect, authorize("student"), async (req, res) => {
  const student = await Student.findOne({ user: req.user._id }).populate("user", "name role rollNumber");

  if (!student) {
    return res.status(404).json({ message: "Student result not found." });
  }

  res.json(student);
});

router.get("/", protect, authorize("admin", "faculty"), async (req, res) => {
  const { search = "" } = req.query;
  const query = search
    ? {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { rollNumber: { $regex: search, $options: "i" } },
          { department: { $regex: search, $options: "i" } },
        ],
      }
    : {};

  const students = await Student.find(query)
    .populate("user", "name role rollNumber email")
    .sort({ createdAt: -1 });

  res.json(students);
});

router.get("/lookup/:rollNumber", async (req, res) => {
  const student = await Student.findOne({ rollNumber: req.params.rollNumber }).select("-user");

  if (!student) {
    return res.status(404).json({ message: "Student result not found." });
  }

  res.json(student);
});

router.post("/", protect, authorize("admin", "faculty"), async (req, res) => {
  const marks = parseMarks(req.body);
  const {
    name,
    rollNumber,
    department,
    semester,
    section,
    remarks = "",
    password,
  } = req.body;

  const validationMessage = validatePayload({
    name,
    rollNumber,
    department,
    semester,
    section,
    marks,
    password,
  });

  if (validationMessage) {
    return res.status(400).json({ message: validationMessage });
  }

  const existingStudent = await Student.findOne({ rollNumber });
  if (existingStudent) {
    return res.status(409).json({ message: "A student with this roll number already exists." });
  }

  const existingUser = await User.findOne({ rollNumber });
  if (existingUser) {
    return res.status(409).json({ message: "A student login with this roll number already exists." });
  }

  const hashedPassword = await bcrypt.hash(password || `${rollNumber}@123`, 10);
  const studentUser = await User.create({
    name,
    rollNumber,
    password: hashedPassword,
    role: "student",
  });

  const resultSummary = calculateResult(marks);

  const student = await Student.create({
    user: studentUser._id,
    name,
    rollNumber,
    department,
    semester: Number(semester),
    section,
    marks,
    remarks,
    ...resultSummary,
  });

  const populatedStudent = await student.populate("user", "name role rollNumber");
  res.status(201).json(populatedStudent);
});

router.put("/:id", protect, authorize("admin", "faculty"), async (req, res) => {
  const marks = parseMarks(req.body);
  const {
    name,
    rollNumber,
    department,
    semester,
    section,
    remarks = "",
    password,
  } = req.body;

  const validationMessage = validatePayload({
    name,
    rollNumber,
    department,
    semester,
    section,
    marks,
    password,
  });

  if (validationMessage) {
    return res.status(400).json({ message: validationMessage });
  }

  const student = await Student.findById(req.params.id);
  if (!student) {
    return res.status(404).json({ message: "Student record not found." });
  }

  const duplicateStudent = await Student.findOne({
    rollNumber,
    _id: { $ne: req.params.id },
  });

  if (duplicateStudent) {
    return res.status(409).json({ message: "Another student already uses this roll number." });
  }

  const resultSummary = calculateResult(marks);

  student.name = name;
  student.rollNumber = rollNumber;
  student.department = department;
  student.semester = Number(semester);
  student.section = section;
  student.marks = marks;
  student.remarks = remarks;
  student.total = resultSummary.total;
  student.percentage = resultSummary.percentage;
  student.grade = resultSummary.grade;

  await student.save();

  const user = await User.findById(student.user);
  if (user) {
    user.name = name;
    user.rollNumber = rollNumber;
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }
    await user.save();
  }

  const updatedStudent = await Student.findById(req.params.id).populate("user", "name role rollNumber");
  res.json(updatedStudent);
});

router.delete("/:id", protect, authorize("admin"), async (req, res) => {
  const student = await Student.findById(req.params.id);

  if (!student) {
    return res.status(404).json({ message: "Student record not found." });
  }

  await User.findByIdAndDelete(student.user);
  await student.deleteOne();

  res.json({ message: "Student record deleted successfully." });
});

module.exports = router;
