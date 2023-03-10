"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Realisation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Realisation.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING(10000),
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "realisations",
      modelName: "Realisation",
    }
  );
  return Realisation;
};
