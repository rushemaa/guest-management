const getRansadomString = (num) => {
  try {
    let allVariable =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const length = allVariable.length;
    for (let i = 0; i < num; i++) {
      result += allVariable.charAt(Math.floor(Math.random() * length));
    }
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const getWeekStartDateAndEndDate = () => {
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
  return { firstDate, lastDate };
};

// console.log(getRansadomString(3));
module.exports = { getRansadomString, getWeekStartDateAndEndDate };
