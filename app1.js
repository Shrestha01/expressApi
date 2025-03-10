const express = require("express");
const mongoose = require("mongoose");
const dbConnection = require("./DBConnection/dbConnection");
const User = require("./Schema/UserSchema");
const app = express();
require("dotenv").config();
const cors = require("cors");

// Enable CORS for all domains (you can customize this to restrict access to specific domains)
app.use(cors());

// Middleware to parse incoming requests with JSON payloads
app.use(express.json());

// DBConnection
dbConnection();

// Specify the collection name 'user'

// Route to delete a user by ID
app.delete("/users/:id", async (req, res) => {
  const { id } = req.params; // Get the ID from the URL parameters

  try {
    const user = await User.findByIdAndDelete(id); // Delete user by ID
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    res.status(200).json({
      message: `User with deleted successfully`,
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting user",
      error: error.message,
    });
  }
});

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
