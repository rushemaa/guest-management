const Account = require("./AccountModel");
const jwt = require("jsonwebtoken");
const { password_hashing, compare_password } = require("../../tools/auth");
const Gate = require("../Gates/GateModel");
const { Op } = require("sequelize");
const { checkAccount } = require("../../tools/security");

require("dotenv").config();

const createAccount = async (req, res, next) => {
  try {
    let dt = req.body;
    let user = req.user.user;
    await checkAccount(user, ["ADMIN"]);
    if (!dt.password || !dt.confirmPassword) throw "please enter password";
    if (
      !dt.password.match(
        "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$"
      )
    ) {
      throw "Password must be at least 8 characters in length and must contain at least one number, one upper case letter, one lower case letter and one special character.:Eg Password123!";
    }

    if (dt.password !== dt.confirmPassword) throw "password don't match";
    let hashedPassword = password_hashing(dt.password);

    let savingObj = {
      fullName: dt.fullName,
      institution: dt.institution,
      username: dt.username,
      password: hashedPassword,
      role: dt.role,
      status: "ACTIVE",
    };
    if (dt.role === "GATE") {
      if (!dt.GateId) throw "please select gate";
      let gateSearch = await Gate.findByPk(dt.GateId);
      if (!gateSearch || gateSearch === null) throw "invalid selected gate";
      savingObj.GateId = dt.GateId;
    }
    await Account.create(savingObj);
    return res
      .status(200)
      .json({ status: "ok", message: "user successfully saved ✅" });
  } catch (err) {
    console.log(err);
    if (
      ["SequelizeUniqueConstraintError", "SequelizeValidationError"].includes(
        err.name
      )
    )
      err = err.errors[0].message;
    res.status(412).json({ status: "fail", message: err });
  }
};

const accountlogin = async (req, res) => {
  try {
    if (!req.body.username || !req.body.password) {
      throw "username and password is required";
    } else {
      const hashedPassword = password_hashing(req.body.password);
      const userData = await Account.findOne({
        where: { username: req.body.username, Status: "ACTIVE" },
        attributes: {
          exclude: ["createdAt", "updatedAt", "deletedAt"],
        },
      });
      if (!userData || userData === null) throw "Invalid credentials";
      if (compare_password(req.body.password, userData.password) !== true)
        throw "Invalid credentials";
      delete userData.password;
      jwt.sign(
        {
          user: {
            fullName: userData.fullName,
            role: userData.role,
            username: userData.username,
            institution: userData.institution,
          },
        },
        process.env.SECRET_KEY,
        { expiresIn: "1d" },
        (err, token) => {
          res.json({
            token: token,
            username: userData.username,
            role: userData.role,
            fullName: userData.fullName,
            institution: userData.institution,
          });
        }
      );
    }
  } catch (err) {
    console.log(err);
    if (
      ["SequelizeUniqueConstraintError", "SequelizeValidationError"].includes(
        err.name
      )
    )
      err = err.errors[0].message;
    res.status(412).json({ status: "fail", message: err });
  }
};

const getAllAccount = async (req, res, next) => {
  try {
    let user = req.user.user;
    await checkAccount(user, ["ADMIN"]);
    let { page } = req.params;

    let pagez = req.params.page || 1;
    const pageAsNumber = Number.parseInt(pagez) - 1;

    page = 0;
    if (!Number.isNaN(pageAsNumber) && pageAsNumber > 0) {
      page = pageAsNumber;
    }
    let size = 20;
    let result = await Account.findAndCountAll({
      attributes: {
        exclude: ["createdAt", "updatedAt", "deletedAt", "gateId", "password"],
      },
      offset: page * size,
      limit: size,
    });
    return res.status(200).json({
      status: "ok",
      data: result.rows,
      totalPages: Math.ceil(result.count / size),
    });
  } catch (err) {
    console.log(err);
    if (
      ["SequelizeUniqueConstraintError", "SequelizeValidationError"].includes(
        err.name
      )
    )
      err = err.errors[0].message;
    res.status(412).json({ status: "fail", message: err });
  }
};

const updateAccount = async (req, res, next) => {
  try {
    let dt = req.body;
    let user = req.user.user;
    await checkAccount(user, ["ADMIN"]);
    if (
      dt.password &&
      !dt.password.match(
        "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$"
      )
    )
      throw "Invalid password";

    if (dt.status && !["ACTIVE", "DEACTIVATED"].includes(dt.status))
      throw "invalid status";

    if (
      dt.role &&
      !["HOST", "SECURITY OFFICER", "ADMIN", "GATE"].includes(dt.role)
    )
      throw "invalid role";
    if (
      !dt.id ||
      dt.id === null ||
      dt.id === "" ||
      (await Account.findOne({
        where: { id: dt.id },
      })) === null
    )
      throw "no account found";

    if (
      dt.username &&
      (await Account.findOne({
        where: {
          username: dt.username,
          id: { [Op.ne]: dt.id },
          status: "ACTIVE",
        },
      })) !== null
    )
      throw "username has alread taken";

    Account.update(dt, { where: { id: dt.id } });
    return res
      .status(200)
      .json({ status: "ok", message: "account has been successfully updated" });
  } catch (err) {
    console.log(err);
    if (
      ["SequelizeUniqueConstraintError", "SequelizeValidationError"].includes(
        err.name
      )
    )
      err = err.errors[0].message;
    res.status(412).json({ status: "fail", message: err });
  }
};

const deleteAccount = (req, res) => {
  try {
  } catch (err) {}
};
module.exports = {
  createAccount,
  accountlogin,
  getAllAccount,
  updateAccount,
};
