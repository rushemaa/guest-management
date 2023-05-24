const dashboardRoute = require("express").Router();
const { verifyToken } = require("../../tools/auth");
const dashboardController = require("./dashboardController");

dashboardRoute.use(verifyToken);
dashboardRoute.get("/dashStats", dashboardController.getDashboardData);
module.exports = dashboardRoute;
