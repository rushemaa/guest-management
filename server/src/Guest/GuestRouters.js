const guestRoutes = require("express").Router();

const { verifyToken } = require("../../tools/auth");
const guestController = require("./GuestController");

guestRoutes.use(verifyToken);

guestRoutes
  .post("/create", guestController.createGuest)
  .get("/findAll/visitStatus/:visitStatus/page/:1", guestController.findAll)
  .put("/updateVisitStatus", guestController.updateVisitStatus)
  .get("/getGuest/:randomReference", guestController.getGuest)
  .get("/search", guestController.guestSearch)
  .delete("/delete/:randomReference", guestController.deleteGuest)
  .delete("/deleteTransport/:id", guestController.deleteTransport)
  .post("/addTransport", guestController.addTransport)
  .put("/update", guestController.updateGuest)
  .put("/updateTransport", guestController.updateTransport);

module.exports = guestRoutes;
