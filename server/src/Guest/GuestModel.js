const sequelize = require("../../configuration/dbConfig");
const Sequelize = require("sequelize");
const Gate = require("../Gates/GateModel");
const { DataTypes } = Sequelize;

const Guest = sequelize.define(
  "Guest",
  {
    guestNames: {
      type: DataTypes.STRING(60),
      allowNull: false,
      validate: {
        isNull: {
          args: true,
          msg: "please enter guest names",
        },
      },
    },
    guestIdNumber: {
      type: DataTypes.STRING(16),
      allowNull: true,
    },
    guestPhone: {
      type: DataTypes.STRING(13),
      allowNull: true,
    },
    comeFrom: {
      type: DataTypes.STRING(40),
      allowNull: true,
    },
    time: {
      type: DataTypes.TIME,
      allowNull: false,
      validate: {
        isNull: {
          args: true,
          msg: "please enter guest arrival time",
        },
      },
    },
    Date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isNull: {
          args: true,
          msg: "please enter guest arraval date",
        },
      },
    },
    hostFullName: {
      type: DataTypes.STRING(40),
      allowNull: false,
      validate: {
        isNull: {
          args: true,
          msg: "please enter host fullname",
        },
      },
    },
    hostCallSign: {
      type: DataTypes.STRING(13),
      allowNull: true,
    },
    recieverFullName: {
      type: DataTypes.STRING(40),
      allowNull: false,
      validate: {
        isNull: {
          args: true,
          msg: "please enter reciever fullname",
        },
      },
    },
    recieverPhoneNumber: {
      type: DataTypes.STRING(13),
      allowNull: false,
      validate: {
        isNull: {
          args: true,
          msg: "please enter reciever phone number",
        },
      },
    },
    condition: {
      type: DataTypes.STRING(40),
      allowNull: true,
    },
  },
  {
    paranoid: true,
    timestamps: true,
    freezeTableName: true,
  }
);

Gate.hasMany(Guest, {
  foreignKey: "gate",
});
Guest.belongsTo(Gate, {
  foreignKey: "gate",
});

Guest.sync({ alter: false, force: false })
  .then()
  .catch((err) => {
    console.log(err);
  });

module.exports = Guest;

