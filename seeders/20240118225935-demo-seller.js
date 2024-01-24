"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Sellers", [
      {
        id: "85252c6d-c6c3-47b0-ac98-d4134c2996c0",
        businessName: "John",
        email: "example@example.com",
        password: "doe1234",
        confirmPassword: "doe1234",
        phoneNumber: "44852739648367",
        country: "USA",
        city: "Dallas",
        websiteLink: "somewebsite.com",
        verifiedSeller: "yes",
        avatar: "avatar.com",
        taxId: "DA438352005",
        catagories: "beauty",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Sellers", null, {});
  },
};
