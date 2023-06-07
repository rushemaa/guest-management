const { checkAccount, findOneData } = require("../../tools/security");
const Account = require("../Account/AccountModel");
const { dashBoardData, graphWeeklyData } = require("./dashboardFunction");

const getDashboardData = async (req, res) => {
  try {
    let user = req.user.user;
    await checkAccount(user, [
      "ADMIN",
      "HOST",
      "SECURITY OFFICER",
      "COMMAND POST",
      "GATE",
    ]);
    let findId = await Account.findOne({
      where: { username: user.username, status: "ACTIVE" },
      attributes: ["id"],
    });

    let result = await dashBoardData(user.role, findId.id);
    return res.status(200).json({ status: "ok", data: result });
  } catch (err) {
    console.log(err);
    if (["SequelizeUniqueConstraintError"].includes(err.name)) {
      err = err.errors[0].message;
    } else if (
      ["SequelizeDatabaseError", "SequelizeForeignKeyConstraintError"].includes(
        err.name
      )
    ) {
      err = err.parent.sqlMessage;
    }
    res.status(412).json({ status: "fail", message: err });
  }
};

const dashboardGraphWeeklyData = async (req, res) => {
  try {
    let user = req.user.user;
    await checkAccount(user, [
      "ADMIN",
      "HOST",
      "SECURITY OFFICER",
      "COMMAND POST",
      "GATE",
    ]);
    let findId = await Account.findOne({
      where: { username: user.username, status: "ACTIVE" },
      attributes: ["id"],
    });
    let result = await graphWeeklyData(user.role,findId.id);
    return res.status(200).json({ status: "ok", data: result });
  } catch (err) {
    console.log(err);
    if (["SequelizeUniqueConstraintError"].includes(err.name)) {
      err = err.errors[0].message;
    } else if (
      ["SequelizeDatabaseError", "SequelizeForeignKeyConstraintError"].includes(
        err.name
      )
    ) {
      err = err.parent.sqlMessage;
    }
    res.status(412).json({ status: "fail", message: err });
  }
};

module.exports = { getDashboardData, dashboardGraphWeeklyData };
