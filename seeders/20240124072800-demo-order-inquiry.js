"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("order_inquiries", [
      {
        id: "74742c6d-c6c3-47b0-ac98-d4134c2996c0",
        user_name: "lara",
        shopping_email: "larashopping@gmail.com",
        sex: "female",
        age: "37",
        country: "united states",
        city: "new york",
        order_description: " i want black shoes with diamond shape",
        budget: "120 usd",
        category: "shoes",
        item_state: "new",
        item_quantity: "1",
        only_verified_seller: "false",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("order_inquiries", null, {});
  },
};
