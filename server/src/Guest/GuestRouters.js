const guestRoutes = require("express").Router();

const { verifyToken } = require("../../tools/auth");
const guestController = require("./GuestController");

guestRoutes.use(verifyToken);

guestRoutes.post("/create", guestController.createGuest);

module.exports = guestRoutes;