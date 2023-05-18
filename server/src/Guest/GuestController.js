const Guest = require("./GuestModel");

const createGuest = async (req, res) => {
  try {
    // let user=req.user.user
    let dt = req.body;

    let result = await Guest.create(dt);

    return res.status(200).json({ status: "ok", data: dt });
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

const findAll = async (req, res) => {
  try {
  } catch (err) {}
};

module.exports = { createGuest };
