const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10;

require("dotenv").config();

const config = process.env;

const verifyToken = (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers.token;

  if (!token) {
    return res.status(403).json({
      status: "fail",
      message: "A token is required for authentication",
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
  } catch (err) {
    return res.status(401).json({ status: "fail", message: "Invalid token" });
  }
  return next();
};
const decodeToken = (token) => {
  const decoded = jwt.verify(token, configuration.secret_key);
  return decoded;
};

const password_hashing = (entered_password) => {
  const hash = bcrypt.hashSync(entered_password, saltRounds);
  return hash;
};

const compare_password = (entered_password, db_password) => {
  const result = bcrypt.compareSync(entered_password, db_password);
  return result;
};
module.exports = { verifyToken, password_hashing, compare_password };
