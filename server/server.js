const express = require("express");
const cors = require("cors");

require("dotenv").config();
require("./src/Guest/GuestModel");

const app = express();

const corsOption = {
  origin: "*",
  methods: "*",
};

app.use(cors(corsOption));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});

const accountRoutes = require("./src/Account/AccountRoutes");
const gatesRoutes = require("./src/Gates/GateRoutes");
const guestRoutes = require("./src/Guest/GuestRouters");
const hostRoutes = require("./src/Host/HostRoutes");

app.use("/account", accountRoutes);
app.use("/gate", gatesRoutes);
app.use("/guest", guestRoutes);
app.use("/host", hostRoutes);

app.get("/test", (req, res) => {
  res.send("API testing ...");
});

app.all("*", (req, res) => {
  res.status(404).json({ status: "fail", message: "no route found" });
});
