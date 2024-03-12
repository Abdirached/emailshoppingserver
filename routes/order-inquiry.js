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
        (template) => template.Name === "EMAIL_SHOPPINGv4"
      );
      console.log(templateExists, "check");
      if (!templateExists) {
        const createTemplateCommand = new CreateTemplateCommand({
          Template: {
            TemplateName: "EMAIL_SHOPPINGv4" /* required */,
            HtmlPart: `<head>
            <title></title>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0"><!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]--><!--[if !mso]><!-->
            <link href="https://fonts.googleapis.com/css?family=Lato" rel="stylesheet" type="text/css"><!--<![endif]-->
            <style>
              * {
                box-sizing: border-box;
              }
          
              body {
                margin: 0;
                padding: 0;
              }
          
              a[x-apple-data-detectors] {
                color: inherit !important;
                text-decoration: inherit !important;
              }
          
              #MessageViewBody a {
                color: inherit;
                text-decoration: none;
              }
          
              p {
                line-height: inherit
              }
          
              .desktop_hide,
              .desktop_hide table {
                mso-hide: all;
                display: none;
                max-height: 0px;
                overflow: hidden;
              }
          
              .image_block img+div {
                display: none;
              }
          
              @media (max-width:670px) {
                .social_block.desktop_hide .social-table {
                  display: inline-block !important;
                }
          
                .image_block div.fullWidth {
                  max-width: 100% !important;
                }
          
                .mobile_hide {
                  display: none;
                }
          
                .row-content {
                  width: 100% !important;
                }
          
                .stack .column {
                  width: 100%;
                  display: block;
                }
          
                .mobile_hide {
                  min-height: 0;
                  max-height: 0;
                  max-width: 0;
                  overflow: hidden;
                  font-size: 0px;
                }
          
                .desktop_hide,
                .desktop_hide table {
                  display: table !important;
                  max-height: none !important;
                }
              }
            </style>
          </head>
          
          <body style="background-color: #F5F5F5; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
            <table class="nl-container" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #F5F5F5;">
              <tbody>
                <tr>
                  <td>
                    <table class="row row-1" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                      <tbody>
                        <tr>
                          <td>
                            <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 650px; margin: 0 auto;" width="650">
                              <tbody>
                                <tr>
                                  <td class="column column-1" width="100%" style="font-weight: 400; text-align: left; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                    <div class="spacer_block block-1" style="height:30px;line-height:30px;font-size:1px;">&#8202;</div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table class="row row-2" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                      <tbody>
                        <tr>
                          <td>
                            <table class="row-content" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF; color: #333; width: 650px; margin: 0 auto;" width="650">
                              <tbody>
                                <tr>
                                  <td class="column column-1" width="50%" style="font-weight: 400; text-align: left; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding-bottom: 25px; padding-left: 25px; padding-top: 25px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                    <table class="image_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                      <tr>
                                        <td class="pad" style="padding-top:5px;width:100%;padding-right:0px;padding-left:0px;">
                                          <div class="alignment" align="left" style="line-height:10px">
                                            <div class="fullWidth" style="max-width: 195px;"><img src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/381/Logo.png" style="display: block; height: auto; border: 0; width: 100%;" width="195" alt="Image" title="Image"></div>
                                          </div>
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                  <td class="column column-2" width="50%" style="font-weight: 400; text-align: left; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding-bottom: 25px; padding-right: 25px; padding-top: 25px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                    <table class="button_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                      <tr>
                                        <td class="pad" style="padding-bottom:10px;padding-left:10px;padding-top:10px;text-align:right;">
                                          <div class="alignment" align="right"><!--[if mso]>
          <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="#" style="height:34px;width:101px;v-text-anchor:middle;" arcsize="42%" stroke="false" fillcolor="#6f00fe">
          <w:anchorlock/>
          <v:textbox inset="0px,0px,0px,0px">
          <center style="color:white; font-family:Tahoma, Verdana, sans-serif; font-size:14px">
          <![endif]--><a href="#" target="_blank" style="text-decoration:none;display:inline-block;color:white;background-color:#6f00fe;border-radius:14px;width:auto;border-top:0px solid transparent;font-weight:undefined;border-right:0px solid transparent;border-bottom:0px solid transparent;border-left:0px solid transparent;padding-top:3px;padding-bottom:3px;font-family:'Lato', Tahoma, Verdana, Segoe, sans-serif;font-size:14px;text-align:center;mso-border-alt:none;word-break:keep-all;"><span style="padding-left:15px;padding-right:15px;font-size:14px;display:inline-block;letter-spacing:normal;"><span style="word-break:break-word;"><span style="line-height: 28px;" data-mce-style>My account</span></span></span></a><!--[if mso]></center></v:textbox></v:roundrect><![endif]--></div>
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table class="row row-3" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                      <tbody>
                        <tr>
                          <td>
                            <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #6f00fe; color: #000000; width: 650px; margin: 0 auto;" width="650">
                              <tbody>
                                <tr>
                                  <td class="column column-1" width="100%" style="font-weight: 400; text-align: left; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding-bottom: 15px; padding-top: 55px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                    <table class="paragraph_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                      <tr>
                                        <td class="pad" style="padding-bottom:5px;padding-left:15px;padding-right:10px;padding-top:20px;">
                                          <div style="color:white;font-family:'Lato', Tahoma, Verdana, Segoe, sans-serif;font-size:38px;line-height:120%;text-align:center;mso-line-height-alt:45.6px;">
                                            <p style="margin: 0; word-break: break-word;"><strong>Thanks for your Order</strong></p>
                                          </div>
                                        </td>
                                      </tr>
                                    </table>
                                    <table class="paragraph_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                      <tr>
                                        <td class="pad" style="padding-bottom:10px;padding-left:40px;padding-right:40px;">
                                          <div style="color:white;font-family:'Lato', Tahoma, Verdana, Segoe, sans-serif;font-size:22px;line-height:120%;text-align:center;mso-line-height-alt:26.4px;">
                                            <p style="margin: 0; word-break: break-word;"><span><span>Hello {{name}}, you have a new order inquiry from {{BuyerName}}<br></span></span></p>
                                          </div>
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table class="row row-4" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                      <tbody>
                        <tr>
                          <td>
                            <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #6f00fe; color: #333; width: 650px; margin: 0 auto;" width="650">
                              <tbody>
                                <tr>
                                  <td class="column column-1" width="100%" style="font-weight: 400; text-align: left; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF; border-bottom: 12px solid #6f00fe; border-left: 12px solid #6f00fe; border-right: 12px solid #6f00fe; border-top: 12px solid #6f00fe; padding-bottom: 10px; padding-left: 15px; padding-top: 5px; vertical-align: top;">
                                    <table class="paragraph_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                      <tr>
                                        <td class="pad" style="padding-bottom:5px;padding-left:15px;padding-right:15px;padding-top:15px;">
                                          <div style="color:#6f00fe;font-family:'Lato', Tahoma, Verdana, Segoe, sans-serif;font-size:24px;font-weight:400;line-height:120%;text-align:left;mso-line-height-alt:28.799999999999997px;">
                                            <p style="margin: 0; word-break: break-word;"><span style="color: #0925fa;"><strong>Summary</strong></span></p>
                                          </div>
                                        </td>
                                      </tr>
                                    </table><!--[if mso]><style>#list-r3c0m1 ul{ margin: 0 !important; padding: 0 !important; } #list-r3c0m1 ul li{ mso-special-format: bullet; }#list-r3c0m1 .levelOne li { margin-top: 0 !important; } #list-r3c0m1 .levelOne { margin-left: -20px !important; }#list-r3c0m1 .levelTwo li { margin-top: 0 !important; } #list-r3c0m1 .levelTwo { margin-left: 10px !important; }#list-r3c0m1 .levelThree li { margin-top: 0 !important; } #list-r3c0m1 .levelThree { margin-left: 40px !important; }#list-r3c0m1 .levelFour li { margin-top: 0 !important; } #list-r3c0m1 .levelFour { margin-left: 70px !important; }#list-r3c0m1 .levelFive li { margin-top: 0 !important; } #list-r3c0m1 .levelFive { margin-left: 100px !important; }#list-r3c0m1 .levelSix li { margin-top: 0 !important; } #list-r3c0m1 .levelSix { margin-left: 130px !important; }#list-r3c0m1 .levelSeven li { margin-top: 0 !important; } #list-r3c0m1 .levelSeven { margin-left: 160px !important; }#list-r3c0m1 .levelEight li { margin-top: 0 !important; } #list-r3c0m1 .levelEight { margin-left: 190px !important; }</style><![endif]-->
                                    <table class="list_block block-2" id="list-r3c0m1" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                      <tr>
                                        <td class="pad">
                                          <div class="levelOne" style="margin-left: 0;">
                                            <ul class="leftList" start="1" style="margin-top: 0; margin-bottom: 0; padding: 0; padding-left: 20px; font-weight: 400; text-align: left; color: #101112; direction: ltr; font-family: Lato,Tahoma,Verdana,Segoe,sans-serif; font-size: 16px; letter-spacing: 0; line-height: 120%; mso-line-height-alt: 19.2px; list-style-type: disc;">
                                              <li style="margin-bottom: 0; text-align: left;">This is an unordered list : &nbsp;publishing and graphic design</li>
                                              <li style="margin-bottom: 0; text-align: left;">This is an unordered list :&nbsp; publishing and graphic design</li>
                                              <li style="margin-bottom: 0; text-align: left;">This is an unordered list : &nbsp;publishing and graphic design</li>
                                              <li style="margin-bottom: 0; text-align: left;">This is an unordered list :&nbsp; publishing and graphic design</li>
                                              <li style="margin-bottom: 0; text-align: left;">This is an unordered list : &nbsp;publishing and graphic design</li>
                                            </ul>
                                          </div>
                                        </td>
                                      </tr>
                                    </table>
                                    <table class="text_block block-3" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                      <tr>
                                        <td class="pad" style="padding-bottom:30px;padding-left:15px;padding-right:15px;padding-top:5px;">
                                          <div style="font-family: sans-serif">
                                            <div class style="font-size: 12px; font-family: 'Lato', Tahoma, Verdana, Segoe, sans-serif; text-align: justify; mso-line-height-alt: 18px; color: #555555; line-height: 1.5;">
                                              <p style="margin: 0; mso-line-height-alt: 18px; letter-spacing: normal;">&nbsp;</p>
                                            </div>
                                          </div>
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table class="row row-5" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                      <tbody>
                        <tr>
                          <td>
                            <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #6f00fe; color: #000000; width: 650px; margin: 0 auto;" width="650">
                              <tbody>
                                <tr>
                                  <td class="column column-1" width="100%" style="font-weight: 400; text-align: left; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding-bottom: 35px; padding-top: 15px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                    <table class="button_block block-1" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                      <tr>
                                        <td class="pad">
                                          <div class="alignment" align="center"><!--[if mso]>
          <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="#" style="height:46px;width:232px;v-text-anchor:middle;" arcsize="33%" stroke="false" fillcolor="#f8a304">
          <w:anchorlock/>
          <v:textbox inset="0px,0px,0px,0px">
          <center style="color:#ffffff; font-family:Tahoma, Verdana, sans-serif; font-size:18px">
          <![endif]--><a href="#" target="_blank" style="text-decoration:none;display:inline-block;color:#ffffff;background-color:#f8a304;border-radius:15px;width:auto;border-top:0px solid transparent;font-weight:undefined;border-right:0px solid transparent;border-bottom:0px solid transparent;border-left:0px solid transparent;padding-top:5px;padding-bottom:5px;font-family:'Lato', Tahoma, Verdana, Segoe, sans-serif;font-size:18px;text-align:center;mso-border-alt:none;word-break:keep-all;"><span style="padding-left:20px;padding-right:20px;font-size:18px;display:inline-block;letter-spacing:normal;"><span style="word-break:break-word;"><span style="line-height: 36px;" data-mce-style><strong>VIEW ORDER STATUS ›&nbsp;</strong></span></span></span></a><!--[if mso]></center></v:textbox></v:roundrect><![endif]--></div>
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table class="row row-6" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                      <tbody>
                        <tr>
                          <td>
                            <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF; color: #000000; width: 650px; margin: 0 auto;" width="650">
                              <tbody>
                                <tr>
                                  <td class="column column-1" width="100%" style="font-weight: 400; text-align: left; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding-bottom: 5px; padding-top: 15px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                    <table class="paragraph_block block-1" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                      <tr>
                                        <td class="pad">
                                          <div style="color:#101112;direction:ltr;font-family:'Lato', Tahoma, Verdana, Segoe, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:justify;mso-line-height-alt:19.2px;">
                                            <p style="margin: 0;">In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content.In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content.In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content</p>
                                          </div>
                                        </td>
                                      </tr>
                                    </table>
                                    <div class="spacer_block block-2" style="height:20px;line-height:20px;font-size:1px;">&#8202;</div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table class="row row-7" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                      <tbody>
                        <tr>
                          <td>
                            <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF; color: #000000; width: 650px; margin: 0 auto;" width="650">
                              <tbody>
                                <tr>
                                  <td class="column column-1" width="100%" style="font-weight: 400; text-align: left; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-bottom: 9px solid #F5F5F5; padding-bottom: 5px; padding-top: 10px; vertical-align: top; border-top: 0px; border-right: 0px; border-left: 0px;">
                                    <div class="spacer_block block-1" style="height:20px;line-height:20px;font-size:1px;">&#8202;</div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table class="row row-8" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                      <tbody>
                        <tr>
                          <td>
                            <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF; color: #000000; width: 650px; margin: 0 auto;" width="650">
                              <tbody>
                                <tr>
                                  <td class="column column-1" width="100%" style="font-weight: 400; text-align: left; mso-table-lspace: 0pt; mso-table-rspace: 0pt; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                    <div class="spacer_block block-1" style="height:20px;line-height:20px;font-size:1px;">&#8202;</div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table class="row row-9" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                      <tbody>
                        <tr>
                          <td>
                            <table class="row-content" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF; color: #333; width: 650px; margin: 0 auto;" width="650">
                              <tbody>
                                <tr>
                                  <td class="column column-1" width="25%" style="font-weight: 400; text-align: left; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding-bottom: 5px; padding-left: 15px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                    <table class="image_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                      <tr>
                                        <td class="pad" style="width:100%;padding-right:0px;padding-left:0px;">
                                          <div class="alignment" align="center" style="line-height:10px">
                                            <div style="max-width: 59px;"><img src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/381/004-happiness.png" style="display: block; height: auto; border: 0; width: 100%;" width="59" alt="Image" title="Image"></div>
                                          </div>
                                        </td>
                                      </tr>
                                    </table>
                                    <table class="paragraph_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                      <tr>
                                        <td class="pad" style="padding-bottom:5px;padding-right:10px;padding-top:5px;">
                                          <div style="color:#5E5E5E;font-family:'Lato', Tahoma, Verdana, Segoe, sans-serif;font-size:16px;line-height:150%;text-align:center;mso-line-height-alt:24px;">
                                            <p style="margin: 0; word-break: break-word;"><span>Lorem ipsum</span></p>
                                          </div>
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                  <td class="column column-2" width="25%" style="font-weight: 400; text-align: left; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                    <table class="image_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                      <tr>
                                        <td class="pad" style="width:100%;padding-right:0px;padding-left:0px;">
                                          <div class="alignment" align="center" style="line-height:10px">
                                            <div style="max-width: 56.875px;"><img src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/381/003-recommended.png" style="display: block; height: auto; border: 0; width: 100%;" width="56.875" alt="Image" title="Image"></div>
                                          </div>
                                        </td>
                                      </tr>
                                    </table>
                                    <table class="paragraph_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                      <tr>
                                        <td class="pad" style="padding-bottom:5px;padding-right:10px;padding-top:5px;">
                                          <div style="color:#5E5E5E;font-family:'Lato', Tahoma, Verdana, Segoe, sans-serif;font-size:16px;line-height:150%;text-align:center;mso-line-height-alt:24px;">
                                            <p style="margin: 0; word-break: break-word;"><span>Lorem ipsum</span></p>
                                          </div>
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                  <td class="column column-3" width="25%" style="font-weight: 400; text-align: left; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                    <table class="image_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                      <tr>
                                        <td class="pad" style="width:100%;padding-right:0px;padding-left:0px;">
                                          <div class="alignment" align="center" style="line-height:10px">
                                            <div style="max-width: 56.875px;"><img src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/381/002-refund.png" style="display: block; height: auto; border: 0; width: 100%;" width="56.875" alt="Image" title="Image"></div>
                                          </div>
                                        </td>
                                      </tr>
                                    </table>
                                    <table class="paragraph_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                      <tr>
                                        <td class="pad" style="padding-bottom:5px;padding-right:10px;padding-top:5px;">
                                          <div style="color:#5E5E5E;font-family:'Lato', Tahoma, Verdana, Segoe, sans-serif;font-size:16px;line-height:150%;text-align:center;mso-line-height-alt:24px;">
                                            <p style="margin: 0; word-break: break-word;"><span>Lorem ipsum</span></p>
                                          </div>
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                  <td class="column column-4" width="25%" style="font-weight: 400; text-align: left; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding-bottom: 5px; padding-right: 15px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                    <table class="image_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                      <tr>
                                        <td class="pad" style="width:100%;padding-right:0px;padding-left:0px;">
                                          <div class="alignment" align="center" style="line-height:10px">
                                            <div style="max-width: 59px;"><img src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/381/001-customer-service.png" style="display: block; height: auto; border: 0; width: 100%;" width="59" alt="Image" title="Image"></div>
                                          </div>
                                        </td>
                                      </tr>
                                    </table>
                                    <table class="paragraph_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                      <tr>
                                        <td class="pad" style="padding-bottom:5px;padding-right:10px;padding-top:5px;">
                                          <div style="color:#5E5E5E;font-family:'Lato', Tahoma, Verdana, Segoe, sans-serif;font-size:16px;line-height:150%;text-align:center;mso-line-height-alt:24px;">
                                            <p style="margin: 0; word-break: break-word;"><span>Lorem ipsum</span></p>
                                          </div>
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table class="row row-10" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                      <tbody>
                        <tr>
                          <td>
                            <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #F0F0F0; color: #000000; width: 650px; margin: 0 auto;" width="650">
                              <tbody>
                                <tr>
                                  <td class="column column-1" width="100%" style="font-weight: 400; text-align: left; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-bottom: 18px solid #FFFFFF; border-left: 25px solid #FFFFFF; border-right: 25px solid #FFFFFF; border-top: 18px solid #FFFFFF; padding-bottom: 5px; padding-left: 35px; padding-right: 35px; padding-top: 15px; vertical-align: top;">
                                    <table class="paragraph_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                      <tr>
                                        <td class="pad" style="padding-bottom:10px;padding-left:15px;padding-right:15px;padding-top:15px;">
                                          <div style="color:#f8a304;font-family:'Lato', Tahoma, Verdana, Segoe, sans-serif;font-size:34px;line-height:120%;text-align:center;mso-line-height-alt:40.8px;">
                                            <p style="margin: 0; word-break: break-word;"><span><strong><span>Troubles?&nbsp;<br></span></strong><span style="color: #000000;">We're here to help you</span></span></p>
                                          </div>
                                        </td>
                                      </tr>
                                    </table>
                                    <table class="paragraph_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                      <tr>
                                        <td class="pad" style="padding-bottom:30px;padding-left:10px;padding-right:10px;">
                                          <div style="color:#787878;font-family:'Lato', Tahoma, Verdana, Segoe, sans-serif;font-size:18px;line-height:150%;text-align:center;mso-line-height-alt:27px;">
                                            <p style="margin: 0; word-break: break-word;"><span>Lorem ipsum dolor sit amet at<span style="color: #040dfb;"> <strong><a style="text-decoration: none; color: #6f00fe;" href="#" target="_blank" rel="noopener"><span style="color: #0925fa;">support@netshop.com</span></a></strong></span></span><span><br><strong>Monday through Friday 8:30-5:30 PST</strong></span></p>
                                          </div>
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table class="row row-11" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                      <tbody>
                        <tr>
                          <td>
                            <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF; color: #000000; width: 650px; margin: 0 auto;" width="650">
                              <tbody>
                                <tr>
                                  <td class="column column-1" width="100%" style="font-weight: 400; text-align: left; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding-bottom: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                    <div class="spacer_block block-1" style="height:20px;line-height:20px;font-size:1px;">&#8202;</div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table class="row row-12" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                      <tbody>
                        <tr>
                          <td>
                            <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 650px; margin: 0 auto;" width="650">
                              <tbody>
                                <tr>
                                  <td class="column column-1" width="100%" style="font-weight: 400; text-align: left; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding-bottom: 60px; padding-top: 20px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                    <table class="social_block block-1" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                      <tr>
                                        <td class="pad">
                                          <div class="alignment" align="center">
                                            <table class="social-table" width="188px" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block;">
                                              <tr>
                                                <td style="padding:0 15px 0 0px;"><a href="https://www.facebook.com" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/facebook@2x.png" width="32" height="32" alt="Facebook" title="Facebook" style="display: block; height: auto; border: 0;"></a></td>
                                                <td style="padding:0 15px 0 0px;"><a href="https://www.twitter.com" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/twitter@2x.png" width="32" height="32" alt="Twitter" title="Twitter" style="display: block; height: auto; border: 0;"></a></td>
                                                <td style="padding:0 15px 0 0px;"><a href="https://www.instagram.com" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/instagram@2x.png" width="32" height="32" alt="Instagram" title="Instagram" style="display: block; height: auto; border: 0;"></a></td>
                                                <td style="padding:0 15px 0 0px;"><a href="https://www.pinterest.com" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/pinterest@2x.png" width="32" height="32" alt="Pinterest" title="Pinterest" style="display: block; height: auto; border: 0;"></a></td>
                                              </tr>
                                            </table>
                                          </div>
                                        </td>
                                      </tr>
                                    </table>
                                    <table class="paragraph_block block-2" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                      <tr>
                                        <td class="pad">
                                          <div style="color:#555555;font-family:'Lato', Tahoma, Verdana, Segoe, sans-serif;font-size:14px;line-height:150%;text-align:center;mso-line-height-alt:21px;">
                                            <p style="margin: 0; word-break: break-word;">NetShop - Lorem ipsum dolor sit amet hasellus sagittis aliquam luctus.&nbsp;</p>
                                            <p style="margin: 0; word-break: break-word;">329 California St, San Francisco, CA 94118</p>
                                          </div>
                                        </td>
                                      </tr>
                                    </table>
                                    <table class="divider_block block-3" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                      <tr>
                                        <td class="pad">
                                          <div class="alignment" align="center">
                                            <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="60%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                              <tr>
                                                <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px dotted #C4C4C4;"><span>&#8202;</span></td>
                                              </tr>
                                            </table>
                                          </div>
                                        </td>
                                      </tr>
                                    </table>
                                    <table class="paragraph_block block-4" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                      <tr>
                                        <td class="pad">
                                          <div style="color:#4F4F4F;font-family:'Lato', Tahoma, Verdana, Segoe, sans-serif;font-size:14px;line-height:120%;text-align:center;mso-line-height-alt:16.8px;">
                                            <p style="margin: 0; word-break: break-word;"><span><span style="color: #0925fa;"><a style="text-decoration: none; color: #6f00fe;" href="#" target="_blank" rel="noopener"><strong><span style="color: #3a00ff;">Help& FAQ's</span></strong></a><span style="color: #3a00ff;"> | </span></span><span style="background-color: transparent;">1-998-9283-19832</span></span></p>
                                          </div>
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table class="row row-13" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff;">
                      <tbody>
                        <tr>
                          <td>
                            <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 650px; margin: 0 auto;" width="650">
                              <tbody>
                                <tr>
                                  <td class="column column-1" width="100%" style="font-weight: 400; text-align: left; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                    <table class="empty_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                      <tr>
                                        <td class="pad">
                                          <div></div>
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table><!-- End -->
          </body>`,
            SubjectPart: "Buyer Inquiry",
            TextPart: "{{BuyerDescription}}",
          },
        });
        const createNewTemplate = await sesClient.send(createTemplateCommand);
        console.log(createNewTemplate);
        const sendEmailCommand = new SendBulkTemplatedEmailCommand({
          Source: process.env.EMAILSENDER, // Replace with your actual email address
          Template: "EMAIL_SHOPPINGv4",
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
      } else {
        const sendEmailCommand = new SendBulkTemplatedEmailCommand({
          Source: process.env.EMAILSENDER, // Replace with your actual email address
          Template: "EMAIL_SHOPPINGv4",
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
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

module.exports = router;
