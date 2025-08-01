const express = require("express"); // express jstest
require("dotenv").config(); // for env variable
const app = express(); //app
const Menu = require("./Schema/MenuSchema");
const cors = require("cors");
const nodemailer = require("nodemailer");

const dbConnection = require("./DBConnection/dbConnection"); //DB connection

// Importing env varibles
const port = process.env.PORT;
const email = process.env.GMAIL_USER;
const pass = process.env.GMAIL_PASS;

// Enable CORS for all domains (you can customize this to restrict access to specific domains)
app.use(cors());

//DB connection
dbConnection();
//Express js
app.use(express.json());

// Delete Api for menu Items
// Route to delete a user by ID
app.delete("/api/menu/delete/:id", async (req, res) => {
  const { id } = req.params; // Get the ID from the URL parameters

  try {
    const menu = await Menu.findByIdAndDelete(id); // Delete user by ID findbyIDAndDelete is mongoose method used to delete data from mongoDB database.

    if (!menu) {
      return res.status(404).json({
        message: "Menu Item not found",
      });
    }
    res.status(200).json({
      message: `Menu item with deleted successfully`,
      menu,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting menu !!!",
      error: error.message,
    });
  }
});

//transporter for sending Email
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: email,
    pass: pass,
  },
});

// API to send Email...
app.post("/api/send-email", (req, res) => {
  const { name, email, message } = req.body; // getting Information from Frontend
  console.log(name, email, message);

  // Email Content for Admin
  const mailOptions = {
    from: email,
    to: "adarsha.stha123@gmail.com",
    subject: name,
    html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong> ${message}</p>`,
  };

  //sending mail to admin
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send("Error Sending your Info... Sorry!!!");
    }
    res.status(200).send("Thank you for your Info...");
  });

  // Email Content for User
  const mailOptionsUser = {
    from: "shresthaa1994@gmail.com", // admin email
    to: email, //user email
    subject: "Thank you for your Enquiry",
    html: `<p>Thank you for your Enquiry.</p> <p>We will contact you soon.</p>`,
  };

  transporter.sendMail(mailOptionsUser);
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
app.post("/api/menu/register", async (req, res) => {
  const { name, category, description, price } = req.body;

  // Basic validation
  if (!name || !category || !description || !price) {
    return res.status(400).json({
      message: "Please Send all the field",
    });
  }

  try {
    // Create a new menu item document and save it to the database
    const newMenu = new Menu({
      name,
      category,
      description,
      price,
    });

    // Save the new menu items in database
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
  console.log(`Server is running`);
});
