"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("buyers", "user_id", {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      references: {
        model: "users",
        key: "id",
      },
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("buyers", "user_id");
  },
};
