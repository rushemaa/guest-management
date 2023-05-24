const sequelize = require("../../configuration/dbConfig");
const { QueryTypes } = require("sequelize");

const dashBoardData = async () => {
  try {
    let result = await sequelize.query(
      "SELECT visitStatus as Status, count(id) as Number from Guest WHERE deletedAt is Null group by visitStatus;",
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

module.exports = { dashBoardData };
