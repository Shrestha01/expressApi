const mongoose = require("mongoose");
require("dotenv").config();

// MongoDB connection string (using the 'userDetails' database)
const mongoURI = process.env.MONGO_URI; // Local MongoDB connection

// Function to connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1); // Exit the process with failure
  }
};

module.exports = connectDB;
