"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("sellers", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      business_name: {
        type: Sequelize.STRING,
      },
      country: {
        type: Sequelize.STRING,
      },
      city: {
        type: Sequelize.STRING,
      },
      website_link: {
        type: Sequelize.STRING,
      },
      verified_seller: {
        type: Sequelize.STRING,
      },
      tax_id: {
        type: Sequelize.STRING,
      },
      catagories: {
        type: Sequelize.STRING,
      },
      pereferred_buyer_sex: {
        type: Sequelize.STRING,
      },
      preferred_buyer_age_group: {
        type: Sequelize.STRING,
      },
      seller_type: {
        type: Sequelize.STRING,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("sellers");
  },
};
