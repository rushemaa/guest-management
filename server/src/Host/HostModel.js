const sequelize = require("../../configuration/dbConfig");
const Sequelize = require("sequelize");
const { DataTypes } = Sequelize;

const Host = sequelize.define(
  "Host",
  {
    hostName: {
      type: DataTypes.STRING(40),
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "host name can't be null",
        },
      },
    },
    callSign: {
      type: DataTypes.STRING(13),
      allowNull: true,
    },
    hostPhone: {
      type: DataTypes.STRING(13),
      allowNull: true,
    },
  },
  {
    paranoid: false,
    freezeTableName: true,
    timestamps: false,
  }
);

Host.sync({ alter: false, force: false })
  .then()
  .catch((err) => {
    console.log();
  });

module.exports = Host;
