const passport = require("passport");
const jwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    dialect: "postgres",
  }
);
const User = require("./models/user")(sequelize, Sequelize);
require("dotenv").config();

// Configure passport JWT strategy with Bearer token and error handling

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

const jwtAuth = new jwtStrategy(options, async (payload, done) => {
  try {
    console.log(payload);
    const user = await User.findByPk(payload.id);
    console.log(user);
    if (user) {
      return done(null, user);
    }
    done(null, false);
  } catch (err) {
    console.error(err);
    done(err);
  }
});

module.exports = passport.use(jwtAuth);
