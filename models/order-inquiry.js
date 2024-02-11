"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class order_inquiry extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      order_inquiry.belongsTo(models.user, { foreignKey: "user_id" });
    }
  }
  order_inquiry.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      user_name: DataTypes.STRING,
      shopping_email: DataTypes.STRING,
      sex: DataTypes.STRING,
      age: DataTypes.STRING,
      country: DataTypes.STRING,
      city: DataTypes.STRING,
      order_description: DataTypes.STRING,
      budget: DataTypes.STRING,
      category: DataTypes.STRING,
      item_state: DataTypes.STRING,
      item_quantity: DataTypes.STRING,
      only_verified_seller: DataTypes.STRING,
      video_url: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "order_inquiry",
    }
  );
  return order_inquiry;
};
