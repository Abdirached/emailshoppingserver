"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("sellers", [
      {
        id: "85252c6d-c6c3-47b0-ac98-d4134c2996c0",
        business_name: "John",
        email: "example@example.com",
        password: "doe1234",
        confirm_password: "doe1234",
        phone_number: "44852739648367",
        country: "USA",
        city: "Dallas",
        website_link: "somewebsite.com",
        verified_seller: "yes",
        avatar: "avatar.com",
        tax_id: "DA438352005",
        catagories: "beauty",
        pereferred_buyer_sex: "female",
        preferred_buyer_age_group: "25-40",
        seller_type: "retailer",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("sellers", null, {});
  },
};
