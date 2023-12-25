const express = require("express");
const cors = require("cors");
const { Sequelize } = require("sequelize");
require("dotenv").config();
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
app.get("/", (req, res) => {
  res.send("Hello World! baby");
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
