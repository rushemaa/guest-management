const sequelize = require("../../configuration/dbConfig");
const Sequelize = require("sequelize");
const { password_hashing } = require("../../tools/auth");
const Gate = require("../Gates/GateModel");
const Guest = require("../Guest/GuestModel");
// const Gate = require("../Gates/GateModel");
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
          msg: "please select correct institution",
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
      type: DataTypes.ENUM("HOST", "SECURITY OFFICER", "ADMIN", "GATE","COMMAND POST"),
      allowNull: false,
      validate: {
        isIn: {
          args: [["HOST", "SECURITY OFFICER", "ADMIN", "GATE","COMMAND POST"]],
          msg: "please select correct user role",
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
          msg: "please select correct user status",
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

Gate.hasMany(Account);
Account.belongsTo(Gate);

Account.sync({ alter: false, force: false })
  .then(() => {
    createinitialAccount();
  })
  .catch((err) => {
    console.log(err);
  });

const createinitialAccount = async () => {
  try {
    let resu = await Account.count({
      where: {
        username: "admin",
        status: "ACTIVE",
      },
    });
    if (resu === 0) {
      await Account.create({
        fullName: "initial account",
        username: "admin",
        password: password_hashing("Password@123"),
        role: "ADMIN",
        institution: "NISS",
      }).catch(() => {
        Account.update({ status: "ACTIVE" }, { where: { username: "admin" } });
      });
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
};
module.exports = Account;
