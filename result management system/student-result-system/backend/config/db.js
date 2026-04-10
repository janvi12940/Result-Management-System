const mongoose = require("mongoose");

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/result_management_system";

  await mongoose.connect(mongoUri);
  console.log("MongoDB connected successfully.");
};

module.exports = connectDB;
