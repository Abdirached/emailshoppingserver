const passport = require("passport");
const jwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../models/user");
require("dotenv").config();

// Configure passport JWT strategy with Bearer token and error handling

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("Bearer"),
  secretOrKey: process.env.JWT_SECRET,
};

const jwtAuth = new jwtStrategy(options, async (payload, done) => {
  try {
    const user = await User.findByPk(payload.userId);
    if (!user) {
      return done(null, false, { message: "Invalid token" });
    }
  } catch (err) {
    console.error(err);
    done(err);
  }
});

module.exports = passport.use(jwtAuth);
