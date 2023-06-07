const Host = require("./HostModel");

const findAll = async (req, res) => {
  try {
    let user = req.user.user;

    if (!["ADMIN", "HOST","GATE","COMMAND POST","SECURITY OFFICER"].includes(user.role))
      throw "Access denied";

    let result = await Host.findAll();
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

module.exports = { findAll };
