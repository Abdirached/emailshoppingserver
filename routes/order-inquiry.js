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
const Models = require("../models");
const {
  SESClient,
  GetTemplateCommand,
  CreateTemplateCommand,
  SendBulkTemplatedEmailCommand,
} = require("@aws-sdk/client-ses");
const sesClient = new SESClient({ region: process.env.REGION });
require("dotenv").config();
// get all order inquires by userid
router.get(
  "/:userId",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const orderInquiries = await Models.OrderInquiry.findAll({
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
      const orderInquiry = await Models.OrderInquiry.create({
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
      const sellersInthatLocation = await Models.Seller.findAll({
        where: {
          country: orderInquiry.country,
          catagories: orderInquiry.category,
        },
        include: [
          {
            model: Models.User,
            attributes: {
              exclude: ["password"],
            },
          },
        ],
        order: sequelize.random(),
        limit: 50,
      });
      res.status(201).json(sellersInthatLocation);
      const getTemplateCommand = new GetTemplateCommand({
        TemplateName: "EMAIL_SHOPPING",
      });
      const findTemplate = await sesClient.send(getTemplateCommand);
      console.log(findTemplate);
      if (!findTemplate) {
        const createTemplateCommand = new CreateTemplateCommand({
          Template: {
            TemplateName: "EMAIL_SHOPPING" /* required */,
            HtmlPart:
              "<h1>Hello {{name}},</h1><p>Your favorite animal is {{favoriteanimal}}.</p>",
            SubjectPart: "Buyer Inquiry",
            TextPart: "{{BuyerDescription}}",
          },
        });
        const createNewTemplate = await sesClient.send(createTemplateCommand);
        console.log(createNewTemplate);
        const sendEmailCommand = new SendBulkTemplatedEmailCommand({
          Source: "your-verified-sender-email@example.com", // Replace with your actual email address
          Template: "EMAIL_SHOPPING",
          Destinations: sellersInthatLocation.map((recipient) => ({
            Destination: { ToAddresses: [recipient.User.email] },
            ReplacementTemplateData: recipient.data,
          })),
        });
        const sendEmailToManySellers = await sesClient.send(sendEmailCommand);
        console.log(sendEmailToManySellers);
      }
      const sendEmailCommand = new SendBulkTemplatedEmailCommand({
        Source: "your-verified-sender-email@example.com", // Replace with your actual email address
        Template: "EMAIL_SHOPPING",
        Destinations: sellersInthatLocation.map((recipient) => ({
          Destination: { ToAddresses: [recipient.email] },
          ReplacementTemplateData: recipient.data,
        })),
      });
      const sendEmailToManySellers = await sesClient.send(sendEmailCommand);
      console.log(sendEmailToManySellers);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

module.exports = router;
