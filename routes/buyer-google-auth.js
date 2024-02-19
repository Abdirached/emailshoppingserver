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
const Buyer = require("../models/buyer")(sequelize, Sequelize);
const passport = require("passport");
const jwt = require("jsonwebtoken");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
require("dotenv").config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/signin/google/callback",
      passReqToCallback: true,
    },
    async function (req, accessToken, refreshToken, profile, cb) {
      try {
        const user = await User.findOne({
          where: { email: profile.emails[0].value },
        });
        if (user) {
          req.user = user;
          cb(null, user);
        } else {
          const newUser = await User.create({
            email: profile.emails[0].value,
            password: "1234",
            confirm_password: "1234",
            phone_number: "0",
            avatar: profile.photos[0].value,
            user_role: "buyer",
          });
          const buyer = await Buyer.create({
            user_id: newUser.dataValues.id,
            first_name: profile.name.givenName,
            last_name: profile.name.familyName,
          });
          console.log(buyer);
          req.user = newUser;
          cb(null, newUser);
        }
      } catch (error) {
        cb(error, null);
      }
    }
  )
);
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:3000/sign-in",
  }),
  function (req, res) {
    // Successful authentication, redirect home.
    console.log(req.user);
    const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    console.log(token);
    res.cookie("jwt", token, { httpOnly: true, secure: true }); // Set secure cookie flag for HTTPS only
    res.status(200).json({ message: "Logged in successfully" });
  }
);
module.exports = router;
