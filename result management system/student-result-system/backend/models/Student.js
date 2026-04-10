const mongoose = require("mongoose");

const marksSchema = new mongoose.Schema(
  {
    math: { type: Number, required: true, min: 0, max: 100 },
    science: { type: Number, required: true, min: 0, max: 100 },
    english: { type: Number, required: true, min: 0, max: 100 },
    computer: { type: Number, required: true, min: 0, max: 100 },
  },
  { _id: false }
);

const studentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    name: { type: String, required: true, trim: true },
    rollNumber: { type: String, required: true, trim: true, unique: true },
    department: { type: String, required: true, trim: true },
    semester: { type: Number, required: true, min: 1, max: 8 },
    section: { type: String, required: true, trim: true },
    marks: { type: marksSchema, required: true },
    total: { type: Number, required: true, min: 0, max: 400 },
    percentage: { type: Number, required: true, min: 0, max: 100 },
    grade: { type: String, required: true, enum: ["A+", "A", "B", "C", "D", "F"] },
    remarks: { type: String, trim: true, default: "" },
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
