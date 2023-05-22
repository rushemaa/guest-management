const guestRoutes = require("express").Router();

const { verifyToken } = require("../../tools/auth");
const guestController = require("./GuestController");

guestRoutes.use(verifyToken);

guestRoutes
  .post("/create", guestController.createGuest)
  .get("/findAll/visitStatus/:visitStatus/page/:1", guestController.findAll)
  .put("/updateVisitStatus", guestController.updateVisitStatus)
  .get("/getGuest/:randomReference", guestController.getGuest);

module.exports = guestRoutes;
