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

// console.log(getRansadomString(3));
module.exports = { getRansadomString };
