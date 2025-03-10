const mongoose = require("mongoose");

// Define the schema for menu items
const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, enum: ["Veg", "Non-Veg"], required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
});

// Create a model for MenuItem
const Menu = mongoose.model("Menu", menuItemSchema, "menu"); //menu is collection name

// Export the model so it can be used in other files
module.exports = Menu;
