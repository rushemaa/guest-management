const sequelize = require("../../configuration/dbConfig");
const Sequelize = require("sequelize");
const { DataTypes } = Sequelize;

const Account = sequelize.define(
  "Account",
  {
    fullName: {
      type: DataTypes.STRING(40),
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "full name can not be empty",
        },
      },
    },
    username: {
      type: DataTypes.STRING(40),
      allowNull: false,
      unique: true,
      validate: {
        notNull: {
          args: true,
          msg: "username can not be null",
        },
      },
    },
    institution: {
      type: DataTypes.ENUM("DI", "NISS"),
      allowNull: false,
      validate: {
        isIn: {
          args: [["DI", "NISS"]],
          msg: "please select collect institution",
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "password can not be null",
        },
      },
    },
    role: {
      type: DataTypes.ENUM("HOST", "SECURITY OFFICER", "ADMIN", "GATE"),
      allowNull: false,
      validate: {
        isIn: {
          args: [["HOST", "SECURITY OFFICER", "ADMIN", "GATE"]],
          msg: "please select collect user role",
        },
      },
    },
    image: {
      type: DataTypes.STRING(80),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("ACTIVE", "DEACTIVATED"),
      defaultValue: "ACTIVE",
      allowNull: false,
      validate: {
        isIn: {
          args: [["ACTIVE", "DEACTIVATED"]],
          msg: "please select collect user status",
        },
      },
    },
  },
  {
    paranoid: true,
    freezeTableName: true,
    timestamps: true,
  }
);

Account.sync({ alter: false, force: false })
  .then()
  .catch((err) => {
    console.log(err);
  });

const createinitialAccount = async () => {
  try {
  } catch (err) {
    console.log(err);
    throw err;
  }
};
module.exports = Account;
