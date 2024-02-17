const express = require("express");
const router = express.Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcrypt");

router.post =
  ("/sign-in",
  async (req, res) => {
    // **Check email and password from user input:**
    const { email, password } = req.body; // Assuming email and password are sent in request body
    const user = await User.findOne({ where: { email } });
    if (
      !user ||
      user.email !== email ||
      !bcrypt.compare(password, user.password)
    ) {
      return done(null, false, { message: "Invalid credentials" });
    }
    done(null, user);

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.cookie("jwt", token, { httpOnly: true, secure: true }); // Set secure cookie flag for HTTPS only
    res.status(200).json({ message: "Logged in successfully" }, user);
  });
module.exports = router;
