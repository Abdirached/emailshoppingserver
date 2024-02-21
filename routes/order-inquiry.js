const express = require("express");
const router = express.Router();
const passport = require("passport");
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
const OrderInquiry = require("../models/order-inquiry")(sequelize, Sequelize);
const Seller = require("../models/seller")(sequelize, Sequelize);

// get all order inquires by userid
router.get(
  "/:userId",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const orderInquiries = await OrderInquiry.findAll({
        where: { user_id: req.params.userId },
        include: [
          {
            model: User,
            attributes: {
              exclude: ["password"],
            },
          },
        ],
      });
      res.status(201).json(orderInquiries);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// create an order-inquiry route
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const {
        user_name,
        shopping_email,
        sex,
        age,
        country,
        city,
        order_description,
        budget,
        category,
        item_state,
        item_quantity,
        only_verified_seller,
        video_url,
      } = req.body;
      const orderInquiry = await OrderInquiry.create({
        user_id: req.user.dataValues.id,
        user_name,
        shopping_email,
        sex,
        age,
        country,
        city,
        order_description,
        budget,
        category,
        item_state,
        item_quantity,
        only_verified_seller,
        video_url,
      });
      const sellersInthatLocation = await Seller.findAll({
        where: {
          country: orderInquiry.country,
          catagories: orderInquiry.category,
        },
        order: sequelize.random(),
        limit: 50,
      });
      res.status(201).json(sellersInthatLocation);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

module.exports = router;
