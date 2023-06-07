const Account = require("../src/Account/AccountModel");

const checkAccount = async (user, role) => {
  try {
    if (
      !role.includes(user.role) ||
      (await Account.findOne({
        where: { username: user.username, status: "ACTIVE" },
      })) === null
    )
      throw "you don't have access 🥵";
    return true;
  } catch (err) {
    throw err;
  }
};

const findOneData = async (Model, where, attributes) => {
  try {
    return await Model.findOne(where, attributes);
  } catch (err) {
    throw err;
  }
};

module.exports = { checkAccount, findOneData };
