"use strict";
const { Op, Model, where } = require("sequelize");
const sequelize = require("../../configuration/dbConfig");
const { getRansadomString } = require("../../tools/functions");
const Transport = require("../Transportation/TransportModel");
const Guest = require("./GuestModel");
const Account = require("../Account/AccountModel");
const Gate = require("../Gates/GateModel");
const Host = require("../Host/HostModel");

const createGuest = async (req, res, next) => {
  try {
    let user = req.user.user;
    let dt = req.body;
    if (!["HOST", "ADMIN"].includes(user.role)) throw "access denied 😡";
    let tim = `${dt.date} ${dt.time}`;
    if (new Date(tim) - new Date() < 0)
      throw "guest arrival date can not be in paast";
    if (!dt.transportation) throw "transport mean is required";

    if (!Array.isArray(dt.transportation))
      throw " transportation must be an array";

    if (typeof dt.transportation[0] !== "object")
      throw "transportation should contain object of vehicle data";
    let trans_data = dt.transportation.map((x) => {
      if (!x.type || x.type === null)
        throw "invalid visitor transportation type";
      if (x.type !== "BY FOOT" && (!x.plateNumber || x.plateNumber === null))
        throw "please enter  vehicle plate number";
      if (x.type === "SELF DRIVE") x.driverFullName = dt.guestFullName;
      return {
        plateNumber: x.plateNumber || null,
        type: x.type,
        vehicleColour: x.vehicleColour || null,
        vehicleModel: x.vehicleModel || null,
        driverFullName: x.driverFullName || null,
        driverPhoneNumber: x.driverPhoneNumber || null,
        driverNationId: x.driverNationId || null,
      };
    });
    const rand = () => {
      let ran = getRansadomString(16);

      let result = Guest.count({ where: { randomReference: ran } });

      if (result > 0) {
        rand();
      }
      return ran;
    };
    let resu = sequelize.transaction(async (t) => {
      dt.guestKeys = "";
      dt.randomReference = rand();
      let guest = await Guest.create(dt, { transaction: t });

      trans_data.forEach((x) => {
        x.GuestId = guest.id;
      });

      let transport = await Transport.bulkCreate(trans_data, {
        transaction: t,
      });
    });
    return res.status(200).json({ status: "ok", message: "guest saved" });
  } catch (err) {
    console.log(err);
    if (
      ["SequelizeUniqueConstraintError", "SequelizeValidationError"].includes(
        err.name
      )
    ) {
      err = err.errors[0].message;
    } else if (
      ["SequelizeDatabaseError", "SequelizeForeignKeyConstraintError"].includes(
        err.name
      )
    ) {
      err = err.parent.sqlMessage;
    }

    res.status(412).json({ status: "fail", message: err });
  }
};

const findAll = async (req, res) => {
  try {
    let user = req.user.user;

    let where = "";
    let attributes = "";
    let { page, visitStatus } = req.params;

    let pagez = req.params.page || 1;
    const pageAsNumber = Number.parseInt(pagez) - 1;

    page = 0;
    if (!Number.isNaN(pageAsNumber) && pageAsNumber > 0) {
      page = pageAsNumber;
    }
    let size = 20;

    if (user.role === "GATE") {
      let getUserGate = await Account.findOne({
        where: { username: user.username, status: "ACTIVE" },
        attributes: ["GateId", "id"],
      });
      if (getUserGate)
        where = {
          visitStatus: "PENDING",
          gate: getUserGate.GateId,
          date: { [Op.gte]: new Date() },
        };
      attributes = {};
      let result = await Guest.findAndCountAll({
        where,
        offset: page * size,
        limit: size,
        attributes: {
          exclude: [
            "id",
            "gate",
            "HostId",
            "createdAt",
            "updatedAt",
            "deletedAt",
            "guestKeys",
          ],
        },
        include: [
          {
            model: Host,
            required: true,
            attributes: { exclude: ["id"] },
          },
          {
            model: Gate,
            required: true,
            attributes: {
              exclude: ["id", "createdAt", "updatedAt", "deletedAt"],
            },
          },
        ],
      });
      let data = result.rows.map((x) => {
        return {
          guestFullName:
            x.guestAnonymous === "ANONYMOUS" ? "xxxxxxx xxx" : x.guestFullName,
          guestIdNumber:
            x.guestAnonymous === "ANONYMOUS" ? "xxxxxxx" : x.guestIdNumber,
          guestPhone:
            x.guestAnonymous === "ANONYMOUS" ? "xxxxxxx" : x.guestPhone,
          comeFrom: x.guestAnonymous === "ANONYMOUS" ? "xxxxxxx" : x.comeFrom,
          time: x.time,
          date: x.date,
          receiverFullName: x.receiverFullName,
          receiverPhoneNumber: x.receiverPhoneNumber,
          conditions: x.conditions,
          guestStatus: x.guestStatus,
          comment: x.comment,
          visitStatus: x.visitStatus,
          guestAnonymous: x.guestAnonymous,
          randomReference: x.randomReference,
          Host: {
            hostName: x.Host.hostName,
            callSign: x.Host.callSign,
          },
          Gate: {
            gate: x.Gate.gate,
          },
        };
      });
      return res.status(200).json({
        status: "ok",
        data: data,
        totalPages: Math.ceil(result.count / size),
      });
    } else if (["HOST", "SECURITY OFFICER", "ADMIN"].includes(user.role)) {
      where = {
        visitStatus:
          visitStatus === "ALL"
            ? ["PENDING", "POSTPONED", "VISITED"]
            : visitStatus,
        date: { [Op.gte]: new Date() },
      };
      let data = await Guest.findAll({
        where,
        attributes: {
          exclude: [
            "gate",
            "Hostid",
            "createdAt",
            "updatedAt",
            "deletedAt",
            "id",
          ],
        },
        include: [
          {
            model: Gate,
            required: false,
            attributes: {
              exclude: ["id", "createdAt", "updatedAt", "deletedAt"],
            },
          },
          {
            model: Host,
            required: false,
            attributes: {
              exclude: ["id", "createdAt", "updatedAt", "deletedAt"],
            },
          },
        ],
      });
      return res.status(200).json({ status: "ok", data: data });
    }
  } catch (err) {
    console.log(err);
    if (
      ["SequelizeUniqueConstraintError", "SequelizeValidationError"].includes(
        err.name
      )
    ) {
      err = err.errors[0].message;
    } else if (
      ["SequelizeDatabaseError", "SequelizeForeignKeyConstraintError"].includes(
        err.name
      )
    ) {
      err = err.parent.sqlMessage;
    }

    res.status(412).json({ status: "fail", message: err });
  }
};

const getGuest = async (req, res, next) => {
  try {
    let user = req.user.user;
    let { randomReference } = req.params;
    let where = "";

    if (user.role === "GATE") {
      let getUserGate = await Account.findOne({
        where: { username: user.username, status: "ACTIVE" },
        attributes: ["GateId", "id"],
      });

      if (!getUserGate || getUserGate === null) throw "Access denied 😡";

      where = {
        randomReference: randomReference,
        visitStatus: "PENDING",
        gate: getUserGate.GateId,
      };
      let findGuest = await Guest.findOne({
        where,
        attributes: {
          exclude: [
            "gate",
            "Hostid",
            "createdAt",
            "updatedAt",
            "deletedAt",
            "id",
          ],
        },
        include: [
          {
            model: Gate,
            required: false,
            attributes: {
              exclude: ["id", "createdAt", "updatedAt", "deletedAt"],
            },
          },
          {
            model: Host,
            required: false,
            attributes: {
              exclude: ["id", "createdAt", "updatedAt", "deletedAt"],
            },
          },
        ],
      });
      if (!findGuest || findGuest === null) throw "No guest found 🥺";
      return res.status(200).json({
        status: "ok",
        data: {
          guestFullName:
            findGuest.guestAnonymous === "ANONYMOUS"
              ? "xxxxxxx xxx"
              : findGuest.guestFullName,
          guestIdNumber:
            findGuest.guestAnonymous === "ANONYMOUS"
              ? "xxxxxxx"
              : findGuest.guestIdNumber,
          guestPhone:
            findGuest.guestAnonymous === "ANONYMOUS"
              ? "xxxxxxx"
              : findGuest.guestPhone,
          comeFrom:
            findGuest.guestAnonymous === "ANONYMOUS"
              ? "xxxxxxx"
              : findGuest.comeFrom,
          time: findGuest.time,
          date: findGuest.date,
          receiverFullName: findGuest.receiverFullName,
          receiverPhoneNumber: findGuest.receiverPhoneNumber,
          conditions: findGuest.conditions,
          guestStatus: findGuest.guestStatus,
          comment: findGuest.comment,
          visitStatus: findGuest.visitStatus,
          guestAnonymous: findGuest.guestAnonymous,
          randomReference: findGuest.randomReference,
          Host: {
            hostName: findGuest.Host.hostName,
            callSign: findGuest.Host.callSign,
          },
          Gate: {
            gate: findGuest.Gate.gate,
          },
        },
      });
    } else {
      where = { randomReference: randomReference };
      let findGuest = await Guest.findOne({
        where,
        attributes: {
          exclude: [
            "gate",
            "Hostid",
            "createdAt",
            "updatedAt",
            "deletedAt",
            "id",
          ],
        },
        include: [
          {
            model: Gate,
            required: false,
            attributes: {
              exclude: ["id", "createdAt", "updatedAt", "deletedAt"],
            },
          },
          {
            model: Host,
            required: false,
            attributes: {
              exclude: ["id", "createdAt", "updatedAt", "deletedAt"],
            },
          },
        ],
      });
      return res.status(200).json({ status: "ok", data: findGuest });
    }
  } catch (err) {
    console.log(err);
    if (
      ["SequelizeUniqueConstraintError", "SequelizeValidationError"].includes(
        err.name
      )
    ) {
      err = err.errors[0].message;
    } else if (
      ["SequelizeDatabaseError", "SequelizeForeignKeyConstraintError"].includes(
        err.name
      )
    ) {
      err = err.parent.sqlMessage;
    }

    res.status(412).json({ status: "fail", message: err });
  }
};

const updateVisitStatus = async (req, res, next) => {
  try {
    let user = req.user.user;
    let { randomReference, visitStatus } = req.body;

    let where = { randomReference: randomReference };

    if (!randomReference || randomReference === null)
      throw "please enter random reference 😡";

    if (user.role === "GATE") {
      visitStatus = "VISITED";
      let getUserGate = await Account.findOne({
        where: { username: user.username, status: "ACTIVE" },
        attributes: ["GateId", "id"],
      });
      if (!getUserGate || getUserGate === null) throw "access denied 😡";
      where.gate = getUserGate.GateId;
      where.visitStatus = "PENDING";
    } else {
      if (!["PENDING", "POSTPONED"].includes(visitStatus))
        throw "Invalid visit status 😡";
    }
    let searchGuest = await Guest.findOne({ where });
    if (!searchGuest || searchGuest === null) throw "No guest found 🥺";
    searchGuest.update({ visitStatus: visitStatus });
    return res.status(200).json({
      status: "ok",
      message: "Guest visit status has been successfully updated ✅",
    });
  } catch (err) {
    console.log(err);
    if (
      ["SequelizeUniqueConstraintError", "SequelizeValidationError"].includes(
        err.name
      )
    ) {
      err = err.errors[0].message;
    } else if (
      ["SequelizeDatabaseError", "SequelizeForeignKeyConstraintError"].includes(
        err.name
      )
    ) {
      err = err.parent.sqlMessage;
    }

    res.status(412).json({ status: "fail", message: err });
  }
};
module.exports = { createGuest, findAll, updateVisitStatus, getGuest };
