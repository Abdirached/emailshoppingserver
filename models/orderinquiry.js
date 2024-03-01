"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class OrderInquiry extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      OrderInquiry.belongsTo(models.User, { foreignKey: "user_id" });
    }
  }
  OrderInquiry.init(
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
      modelName: "OrderInquiry",
    }
  );
  return OrderInquiry;
};
