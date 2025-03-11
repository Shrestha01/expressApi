const express = require("express"); // express js
require("dotenv").config(); // for env variable
const app = express(); //app
const Menu = require("./Schema/MenuSchema");
const cors = require("cors");

const dbConnection = require("./DBConnection/dbConnection"); //DB connection

// Set the port number
const port = process.env.PORT;

// Enable CORS for all domains (you can customize this to restrict access to specific domains)
app.use(cors());

//DB connection
dbConnection();
app.use(express.json());


// Route to delete a user by ID
app.delete("/api/menu/delete/:id", async (req, res) => {
  const { id } = req.params; // Get the ID from the URL parameters

  try {
    const user = await Menu.findByIdAndDelete(id); // Delete user by ID
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

// fetching all the menu from menu collection
app.get("/api/menu", async (req, res) => {
  try {
    const menu = await Menu.find(); // Fetch all users from the database

    res.status(200).json({
      message: "Menu fetched successfully",
      itemNumber: menu.length,
      menu,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching Menu",
      error: error.message,
    });
  }
});

//fetch food according to category
app.get("/api/menu/:category", async (req, res) => {
  const cat = req.params;

  try {
    const newCategory = await Menu.find(cat); // Fetch only 'Veg' items from the database

    if (newCategory.length === 0) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    res.status(200).json({
      message: "Category fetched successfully",
      itemNumber: newCategory.length,
      category: newCategory, // Send the filtered veg menu items
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching Items",
      error: error.message,
    });
  }
});

//route for inserting food details on menu
app.post("/api/menu/add", async (req, res) => {
  const { name, category, description, price } = req.body;

  // Basic validation
  if (!name || !category || !description || !price) {
    return res.status(400).json({
      message: "Please Send all the field",
    });
  }

  try {
    // Create a new user document and save it to the database
    const newMenu = new Menu({
      name,
      category,
      description,
      price,
    });

    // Save the new user
    await newMenu.save();

    res.status(201).json({
      message: "Menu added successfully",
      user: newMenu,
    });
  } catch (error) {
    console.error("Error inserting user:", error);
    res.status(500).json({
      message: "Error inserting user",
      error: error.message,
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
