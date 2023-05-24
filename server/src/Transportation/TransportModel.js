const sequelize = require("../../configuration/dbConfig");
const Sequelize = require("sequelize");
const Guest = require("../Guest/GuestModel");

const { DataTypes } = Sequelize;

const Transport = sequelize.define(
  "Transport",
  {
    plateNumber: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    vehicleColour: {
      type: DataTypes.STRING(40),
      allowNull: true,
    },
    vehicleModel: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    transportType: {
      type: DataTypes.ENUM("SELF DRIVING", "DRIVER", "BY FOOT"),
      allowNull: false,
      validate: {
        isIn: {
          args: [["SELF DRIVING", "DRIVER", "BY FOOT"]],
          msg: "Please select way of transport",
        },
      },
    },
    driverFullName: {
      type: DataTypes.STRING(40),
      allowNull: true,
      validate: {
        validator: function (e) {
          if (this.transportType === "DRIVER" && (!e || e === null)) {
            throw new Error("driver name can not empty");
          }
        },
      },
    },
    driverPhoneNumber: {
      type: DataTypes.STRING(13),
      allowNull: true,
    },
    driverNationId: {
      type: DataTypes.STRING(16),
      allowNull: true,
    },
  },
  {
    paranoid: false,
    timestamps: false,
    freezeTableName: true,
  }
);

Transport.belongsTo(Guest);
Guest.hasMany(Transport);

Transport.sync({ alter: false, force: false })
  .then()
  .catch((err) => {
    console.log(err);
  });

module.exports = Transport;
