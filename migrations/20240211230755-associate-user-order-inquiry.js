"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("order_inquiries", "user_id", {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      references: {
        model: "users",
        key: "id",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("order_inquiries", "user_id");
  },
};
