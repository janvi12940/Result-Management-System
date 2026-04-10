const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const { errorHandler, notFound } = require("./middleware/errorMiddleware");
const { seedDefaultUsers } = require("./utils/seedDefaults");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Result Management System API is running.",
    status: "ok",
  });
});

app.get("/test", (req, res) => {
  res.json({ message: "API test successful." });
});

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);

app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
  await connectDB();
  await seedDefaultUsers();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer().catch((error) => {
  console.error("Unable to start server:", error.message);
  process.exit(1);
});
