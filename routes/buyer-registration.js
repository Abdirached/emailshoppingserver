const express = require("express");
const router = express.Router();
const Models = require("../models");
const bcrypt = require("bcryptjs");
require("dotenv").config();
router.post("/", async (req, res) => {
  try {
    const {
      email,
      password,
      confirm_password,
      phone_number,
      avatar,
      user_role,
      first_name,
      last_name,
    } = req.body;

    // **Input Sanitization and Validation:**
    // Use a library like validator to sanitize and validate inputs

    const existingUser = await Models.User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // **Increased Salt Rounds:**
    const salt = await bcrypt.genSalt(12); // Use at least 12-14 rounds
    console.log(salt, password);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await Models.User.create({
      email,
      password: hashedPassword,
      confirm_password,
      phone_number,
      avatar,
      user_role,
    });
    console.log(user.dataValues.id);
    const buyer = await Models.Buyer.create({
      user_id: user.dataValues.id,
      first_name,
      last_name,
    });

    // **Avoid storing JWT in database:**
    // Instead, store it securely in an HttpOnly cookie (in signin.js)

    res.status(201).json({ message: "User created successfully", user, buyer });
  } catch (err) {
    console.error(err);
    // **Specific Error Handling:**
    // Provide informative messages for validation errors or database errors
    res.status(500).json({ message: "Internal server error" });
  }
});
module.exports = router;
