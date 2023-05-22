const hostRoutes = require("express").Router();

const { verifyToken } = require("../../tools/auth");
const hostControllers = require("./HostController");

hostRoutes.use(verifyToken);

hostRoutes.get("/findAll", hostControllers.findAll);

module.exports = hostRoutes;
