"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.Seller, { foreignKey: "user_id" });
      User.hasOne(models.Buyer, { foreignKey: "user_id" });
      User.hasMany(models.OrderInquiry, { foreignKey: "user_id" });
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      confirm_password: DataTypes.STRING,
      phone_number: DataTypes.STRING,
      avatar: DataTypes.STRING,
      user_role: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
