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
  ListTemplatesCommand,
  GetTemplateCommand,
  CreateTemplateCommand,
  SendBulkTemplatedEmailCommand,
} = require("@aws-sdk/client-ses");
const sesClient = new SESClient({
  credentials: {
    accessKeyId: process.env.ACCESSKEY,
    secretAccessKey: process.env.SECRETACCESSKEY,
  },
  region: process.env.REGION,
});
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
      const listTemplateCommand = new ListTemplatesCommand({});
      const response = await sesClient.send(listTemplateCommand);
      console.log(response, "bal eeg");
      const templateExists = response.TemplatesMetadata.some(
        (template) => template.Name === "EMAIL_SHOPPING"
      );
      console.log(templateExists, "check");
      if (!templateExists) {
        const createTemplateCommand = new CreateTemplateCommand({
          Template: {
            TemplateName: "EMAIL_SHOPPING" /* required */,
            HtmlPart:
              "<h1>Hello {{name}},</h1><p>order inquiry from a {{BuyerName}}.</p>",
            SubjectPart: "Buyer Inquiry",
            TextPart: "{{BuyerDescription}}",
          },
        });
        const createNewTemplate = await sesClient.send(createTemplateCommand);
        console.log(createNewTemplate);
        const sendEmailCommand = new SendBulkTemplatedEmailCommand({
          Source: process.env.SENDEREMAIL, // Replace with your actual email address
          Template: "EMAIL_SHOPPING",
          Destinations: sellersInthatLocation.map((recipient) => ({
            Destination: { ToAddresses: [recipient.User.email] },
            ReplacementTemplateData: JSON.stringify({
              name: sellersInthatLocation[0].business_name,
              BuyerName: orderInquiry.user_name,
              BuyerDescription: orderInquiry.order_description,
            }),
          })),
          DefaultTemplateData: JSON.stringify({
            name: sellersInthatLocation[0].business_name,
            BuyerName: orderInquiry.user_name,
            BuyerDescription: orderInquiry.order_description,
          }),
        });
        const sendEmailToManySellers = await sesClient.send(sendEmailCommand);
        console.log("not existed but created and sent", sendEmailToManySellers);
      }
      const sendEmailCommand = new SendBulkTemplatedEmailCommand({
        Source: process.env.SENDEREMAIL, // Replace with your actual email address
        Template: "EMAIL_SHOPPING",
        Destinations: sellersInthatLocation.map((recipient) => ({
          Destination: { ToAddresses: [recipient.User.email] },
          ReplacementTemplateData: JSON.stringify({
            name: sellersInthatLocation[0].business_name,
            BuyerName: orderInquiry.user_name,
            BuyerDescription: orderInquiry.order_description,
          }),
        })),
        DefaultTemplateData: JSON.stringify({
          name: sellersInthatLocation[0].business_name,
          BuyerName: orderInquiry.user_name,
          BuyerDescription: orderInquiry.order_description,
        }),
      });
      const sendEmailToManySellers = await sesClient.send(sendEmailCommand);
      console.log("existed and sent", sendEmailToManySellers);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

module.exports = router;
