const express = require("express");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();

// Middleware to parse incoming requests with JSON payloads
app.use(express.json());

// MongoDB connection string (using the 'userDetails' database)
const mongoURI = process.env.MONGO_URI; // Local MongoDB connection
// OR if using MongoDB Atlas:
// const mongoURI = 'your-atlas-connection-string';

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("Connected to MongoDB - userDetails database");
  })
  .catch((err) => {
    console.log("Failed to connect to MongoDB", err);
  });

// Define the User schema (ensure it matches the structure of your MongoDB 'user' collection)
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  id: Number,
});

// Create a model based on the schema
const User = mongoose.model("User", userSchema, "user"); // Specify the collection name 'user'

// Route to fetch all users from the 'user' collection
app.get("/users", async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users from the database
    res.status(200).json({
      message: "Users fetched successfully",
      users,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching users",
      error: error.message,
    });
  }
});

// Route to fetch a specific user by name
app.get("/users/:name", async (req, res) => {
  const { name } = req.params;
  console.log(name);

  try {
    const user = await User.find({ id: { $gt: name } }); // Fetch a user by email
    console.log(user);
    if (user) {
      res.status(200).json({
        message: "User found",
        user,
      });
    } else {
      res.status(404).json({
        message: "User not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error fetching user",
      error: error.message,
    });
  }
});

// Route to insert a new user
app.post("/users/register", async (req, res) => {
  const { id, name } = req.body;

  // Basic validation
  if (!id || !name) {
    return res.status(400).json({
      message: "Both 'id' and 'name' are required.",
    });
  }

  try {
    // Create a new user document and save it to the database
    const newUser = new User({
      id,
      name,
    });

    // Save the new user
    await newUser.save();

    res.status(201).json({
      message: "User added successfully",
      user: newUser,
    });
  } catch (error) {
    console.error("Error inserting user:", error);
    res.status(500).json({
      message: "Error inserting user",
      error: error.message,
    });
  }
});

// Set the port number
const port = process.env.PORT;

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
