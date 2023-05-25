const { dashBoardData } = require("./dashboardFunction");

const getDashboardData = async (req, res) => {
  try {
    let user = req.user.user;
    if (user.role === "GATE") throw "Access denied 🥵";
    let result = await dashBoardData();
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

module.exports = { getDashboardData };
