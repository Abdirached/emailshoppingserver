"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Seller extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Seller.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      businessName: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      confirmPassword: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
      country: DataTypes.STRING,
      city: DataTypes.STRING,
      websiteLink: DataTypes.STRING,
      verifiedSeller: DataTypes.STRING,
      avatar: DataTypes.STRING,
      taxId: DataTypes.STRING,
      catagories: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Seller",
    }
  );
  return Seller;
};
