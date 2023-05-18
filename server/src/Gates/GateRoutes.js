const { verifyToken } = require("../../tools/auth");

const gatesRoutes = require("express").Router();

const gatesController = require("./GateController");

gatesRoutes.use(verifyToken);

gatesRoutes.get("/findAll", gatesController.getGates);

module.exports = gatesRoutes;
