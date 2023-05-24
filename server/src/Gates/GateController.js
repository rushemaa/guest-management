const Gate = require("./GateModel");

const getGates = async (req, res) => {
  try {
    let user = req.user.user;

    if (!["ADMIN", "HOST","GATE","SECURITY OFFICER"].includes(user.role)) throw "you don't have access";

    let result = await Gate.findAll({
      attributes: { exclude: ["deletedAt", "updatedAt", "createdAt"] },
    });
    return res.status(200).json({ status: "ok", data: result });
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

module.exports = { getGates };
