"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("order_inquiries", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      user_name: {
        type: Sequelize.STRING,
      },
      shopping_email: {
        type: Sequelize.STRING,
      },
      sex: {
        type: Sequelize.STRING,
      },
      age: {
        type: Sequelize.STRING,
      },
      country: {
        type: Sequelize.STRING,
      },
      city: {
        type: Sequelize.STRING,
      },
      order_description: {
        type: Sequelize.STRING,
      },
      budget: {
        type: Sequelize.STRING,
      },
      category: {
        type: Sequelize.STRING,
      },
      item_state: {
        type: Sequelize.STRING,
      },
      item_quantity: {
        type: Sequelize.STRING,
      },
      video_url: {
        type: Sequelize.STRING,
      },
      only_verified_seller: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("order_inquiries");
  },
};
