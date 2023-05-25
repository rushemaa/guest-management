const sequelize = require("../../configuration/dbConfig");
const Sequelize = require("sequelize");
const Gate = require("../Gates/GateModel");
const Host = require("../Host/HostModel");
const { DataTypes } = Sequelize;

const Guest = sequelize.define(
  "Guest",
  {
    guestFullName: {
      type: DataTypes.STRING(60),
      allowNull: false,
      validate: {
        notNull: {
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
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "please enter where guest is coming from",
        },
      },
    },
    time: {
      type: DataTypes.TIME,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "please enter guest arrival time",
        },
      },
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "please enter guest arraval date",
        },
      },
    },
    receiverFullName: {
      type: DataTypes.STRING(40),
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "please enter reciever fullname",
        },
      },
    },
    receiverPhoneNumber: {
      type: DataTypes.STRING(13),
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "please enter reciever phone number",
        },
      },
    },
    conditions: {
      type: DataTypes.STRING(40),
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "conditions can not be empty",
        },
      },
    },
    guestStatus: {
      type: DataTypes.ENUM("VIP", "VVIP", "NORMAL", "SENIOR OFFICIAL"),
      allowNull: false,
      validate: {
        isIn: {
          args: [["VIP", "VVIP", "NORMAL", "SENIOR OFFICIAL"]],
          msg: "Please select correct status",
        },
      },
    },
    guestAnonymous: {
      type: DataTypes.ENUM("ANONYMOUS", "NORMAL"),
      allowNull: false,
      defaultValue: "NORMAL",
      validate: {
        isIn: {
          args: [["ANONYMOUS", "NORMAL"]],
          msg: "Please select a collect anonymit",
        },
      },
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    visitStatus: {
      type: DataTypes.ENUM("CANCELED", "PENDING", "IN","OUT"),
      defaultValue: "PENDING",
      validate: {
        isIn: {
          args: [["CANCELED", "PENDING", "IN", "OUT"]],
          msg: "Invalid visit status",
        },
      },
    },
    guestKeys: {
      type: DataTypes.STRING(80),
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "guest key is required",
        },
      },
      set(value) {
        this.setDataValue(
          "guestKeys",
          `${this.guestFullName},${this.guestIdNumber},${this.guestPhone},${this.randomReference}`
        );
      },
    },
    randomReference: {
      type: DataTypes.STRING(18),
      unique: true,
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

Host.hasMany(Guest);
Guest.belongsTo(Host);

Guest.sync({ alter: false, force: false })
  .then()
  .catch((err) => {
    console.log(err);
  });

module.exports = Guest;
