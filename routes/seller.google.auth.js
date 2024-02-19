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
const Seller = require("../models/seller")(sequelize, Sequelize);
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
            user_role: "seller",
          });
          const seller = await Seller.create({
            user_id: newUser.dataValues.id,
            business_name: "null",
            country: "null",
            city: "null",
            website_link: "null",
            verified_seller: "null",
            tax_id: "null",
            catagories: "null",
            pereferred_buyer_sex: "null",
            preferred_buyer_age_group: "null",
            seller_type: "null",
          });
          console.log(seller);
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
  passport.authenticate("google-signin", {
    failureRedirect: "http://localhost:3000/sign-in",
  }),
  function (req, res) {
    // Successful authentication, redirect home.
    const id = req.session.userId;
    const token = jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    console.log(token);
    res.cookie("jwt", token, { httpOnly: true, secure: true }); // Set secure cookie flag for HTTPS only
    res.status(200).json({ message: "Logged in successfully" });
  }
);
module.exports = router;
