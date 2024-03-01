"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Buyer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Buyer.belongsTo(models.User, { foreignKey: "user_id" });
    }
  }
  Buyer.init(
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
      first_name: DataTypes.STRING,
      last_name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Buyer",
    }
  );
  return Buyer;
};
