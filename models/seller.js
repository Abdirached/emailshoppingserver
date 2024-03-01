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
      Seller.belongsTo(models.User, { foreignKey: "user_id" });
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
      user_id: {
        type: DataTypes.UUID,
      },
      business_name: DataTypes.STRING,
      country: DataTypes.STRING,
      city: DataTypes.STRING,
      website_link: DataTypes.STRING,
      verified_seller: DataTypes.STRING,
      tax_id: DataTypes.STRING,
      catagories: DataTypes.STRING,
      pereferred_buyer_sex: DataTypes.STRING,
      preferred_buyer_age_group: DataTypes.STRING,
      seller_type: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Seller",
    }
  );
  return Seller;
};
