const mongoose = require("mongoose");

// Define the User schema (ensure it matches the structure of your MongoDB 'user' collection)
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  id: Number,
});

// Create a model based on the schema
const User = mongoose.model("User", userSchema, "user");

module.exports = User;
