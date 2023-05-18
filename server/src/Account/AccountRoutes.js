const accountRoutes = require("express").Router();
const { verifyToken } = require("../../tools/auth");
const accountController = require("./AccountController");

accountRoutes.post("/login", accountController.accountlogin);
accountRoutes.use(verifyToken);
accountRoutes
  .post("/create", accountController.createAccount)
  .get("/findAll/:page", accountController.getAllAccount);

module.exports = accountRoutes;
