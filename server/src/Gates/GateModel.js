const sequelize = require("../../configuration/dbConfig");
const Sequelize = require("sequelize");
const Account = require("../Account/AccountModel");
const { DataTypes } = Sequelize;

const Gate = sequelize.define(
  "Gate",
  {
    gate: {
      type: DataTypes.STRING(40),
      allowNull: false,
      unique: true,
      validate: {
        isNull: {
          args: true,
          msg: "gate name can not null",
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

// Account.belongsTo(Gate);
// Gate.hasMany(Account);


Gate.sync({ alter: false, force: false })
  .then()
  .catch((err) => {
    console.log(err);
  });


  module.exports=Gate