const sequelize = require("../../configuration/dbConfig");
const { QueryTypes } = require("sequelize");

let curr = new Date();
let today = curr.getDay() === 0 ? 7 : curr.getDay();
let first = curr.getDate() - today + 1;
let last = first + 6;
let firstDate = new Date(curr.setDate(first));
firstDate = `${firstDate.getFullYear()}-${
  firstDate.getMonth() + 1
}-${firstDate.getDate()}`;

let lastDate = new Date(curr.setDate(last));
lastDate = `${lastDate.getFullYear()}-${
  lastDate.getMonth() + 1
}-${lastDate.getDate()}`;

const dashBoardData = async (a, b) => {
  try {
    let where = "";
    if (a === "GATE")
      where = `deletedAt is Null AND date = CURRENT_DATE() group by visitStatus`;
    if (a === "HOST")
      where = `(date between '${firstDate}' and '${lastDate}' ) and deletedAt is Null and AccountId =${b} group by visitStatus`;
    if (["COMMAND POST", "ADMIN", "SECURITY OFFICER"].includes(a))
      where = `(date between '${firstDate}' and '${lastDate}' ) and deletedAt is Null group by visitStatus`;
    let result = await sequelize.query(
      `SELECT visitStatus as Status, count(id) as Number from Guest WHERE ${where};`,
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

const graphWeeklyData = async (a, b) => {
  try {
    // let curr = new Date();
    // let today = curr.getDay() === 0 ? 7 : curr.getDay();
    // let first = curr.getDate() - today + 1;
    // let last = first + 6;
    // let firstDate = new Date(curr.setDate(first));
    // firstDate = `${firstDate.getFullYear()}-${
    //   firstDate.getMonth() + 1
    // }-${firstDate.getDate()}`;

    // let lastDate = new Date(curr.setDate(last));
    // lastDate = `${lastDate.getFullYear()}-${
    //   lastDate.getMonth() + 1
    // }-${lastDate.getDate()}`;
    let where = "";
    if (a === "GATE")
      where = `g.deletedAt is Null AND g.date = CURRENT_DATE() group by visitday, visitStatus`;
    if (a === "HOST")
      where = `(g.date between ${firstDate} and "${lastDate}") and g.deletedAt is Null and AccountId = ${b} group by visitday, visitStatus;`;
    if (["COMMAND POST", "ADMIN", "SECURITY OFFICER"].includes(a))
      where = `(date between '${firstDate}' and '${lastDate}' ) and deletedAt is Null group by visitStatus`;
    let result = await sequelize.query(
      `SELECT count(g.id) number, g.visitStatus status, DAYNAME(g.date) as visitday FROM guestDB.Guest as g where ${where}`,
      { type: sequelize.QueryTypes.SELECT }
    );
    return result;
  } catch (err) {
    throw err;
  }
};

module.exports = { dashBoardData, graphWeeklyData };
