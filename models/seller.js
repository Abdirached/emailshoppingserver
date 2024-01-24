"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class seller extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  seller.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      business_name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      confirm_password: DataTypes.STRING,
      phone_number: DataTypes.STRING,
      country: DataTypes.STRING,
      city: DataTypes.STRING,
      website_link: DataTypes.STRING,
      verified_seller: DataTypes.STRING,
      avatar: DataTypes.STRING,
      tax_id: DataTypes.STRING,
      catagories: DataTypes.STRING,
      pereferred_buyer_sex: DataTypes.STRING,
      preferred_buyer_age_group: DataTypes.STRING,
      seller_type: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "seller",
    }
  );
  return seller;
};
