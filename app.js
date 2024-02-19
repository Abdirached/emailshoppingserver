const express = require("express");
const cors = require("cors");
const { Sequelize } = require("sequelize");
const passport = require("passport");
require("dotenv").config();
require("./config/passport-config");
const sellerRegistration = require("./routes/seller-registration");
const buyerRegistration = require("./routes/buyer-registration");
const signIn = require("./routes/sign-in");
const buyerGoogleAuth = require("./routes/buyer-google-auth");
const sellerGoogleAuth = require("./routes/seller.google.auth");
const app = express();
const port = 5000;

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: "localhost",
    dialect: "postgres",
  }
);
(async function () {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();
app.use(cors());
app.use(express.json());
app.use(passport.initialize());
app.use("/seller-registration", sellerRegistration);
app.use("/buyer-registration", buyerRegistration);
app.use("/sign-in", signIn);
app.use("/auth", buyerGoogleAuth);
app.use("/auth", sellerGoogleAuth);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
