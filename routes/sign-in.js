const express = require("express");
const router = express.Router();
const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    dialect: "postgres",
  }
);
const User = require("../models/user")(sequelize, Sequelize);
const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body; // Assuming email and password are sent in request body
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    console.log(token);
    res.cookie("jwt", token, { httpOnly: true, secure: true }); // Set secure cookie flag for HTTPS only
    res.status(200).json({ message: "Logged in successfully" });
  } catch (error) {
    console.error(error);
    // **Specific Error Handling:**
    // Provide informative messages for validation errors or database errors
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
