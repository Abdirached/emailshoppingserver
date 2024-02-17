"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class buyer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      buyer.belongsTo(models.user, { foreignKey: "user_id" });
    }
  }
  buyer.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      first_name: DataTypes.STRING,
      last_name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "buyer",
    }
  );
  return buyer;
};
