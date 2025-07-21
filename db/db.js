const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
require("dotenv").config();

const uri = process.env.MONGO_DB_URL;

const connectDB = async () => {
  try {
    console.log("Attempting to connect to MongoDB...");
    console.log("Connection URI:", uri.replace(/\/\/.*:.*@/, "//***:***@")); // Hide password in logs
    await mongoose.connect(uri);
    console.log("MongoDB connection established successfully");
  } catch (error) {
    console.error("MongoDB connection failed", error.message);
    console.error("Full error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
