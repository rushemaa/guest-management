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

    if (!["HOST", "ADMIN"].includes(user.role)) throw "access denied 😡";
    for (const [key, value] of Object.entries(req.body)) {
      if (value === "undefined" || value === null || value.length === 0) {
        req.body[key] = null;
      }
    }
    let dt = req.body;

    if (!["VIP", "VVIP", "NORMAL", "SENIOR OFFICIAL"].includes(dt.guestStatus))
      throw "guest status is required";

    if (!dt.date || dt.date === "") throw "please enter guest visit date";
    if (!dt.time || dt.time === "") throw "please enter guest visit time";
    let tim = `${dt.date} ${dt.time}`;
    if (new Date(tim) - new Date() < 0)
      throw "guest arrival date can not be in past";

    if (!dt.gate || (await Gate.count({ where: { id: dt.gate } })) === 0)
      throw "Please select correct gate";
    if (!dt.HostId || (await Host.count({ where: { id: dt.HostId } })) === 0)
      throw "Please select correct host";
    if (!dt.transportation) throw "transport mean is required";

    if (!Array.isArray(dt.transportation))
      throw " transportation must be an array";

    if (typeof dt.transportation[0] !== "object")
      throw "transportation should contain object of vehicle data";
    let trans_data = dt.transportation.map((x) => {
      if (!["UNKNOWN", "SELF DRIVING", "DRIVER"].includes(x.type))
        throw `unknown transportation mode ${x.type}`;
      if (!x.type || x.type === null)
        throw "invalid visitor transportation type";
      if (x.type !== "UNKNOWN" && (!x.plateNumber || x.plateNumber === null))
        throw "please enter  vehicle plate number";
      // if (x.type === "SELF DRIVING") x.driverFullName = dt.guestFullName;
      return {
        plateNumber: x.plateNumber || null,
        transportType: x.type,
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

    // return res.status(333).json(trans_data);
    let resu = sequelize
      .transaction(async (t) => {
        dt.guestKeys = "";
        dt.randomReference = rand();
        let guest = await Guest.create(dt, { transaction: t });

        trans_data.forEach((x) => {
          x.GuestId = guest.id;
        });

        await Transport.bulkCreate(trans_data, {
          transaction: t,
        });
      })
      .then(() => {
        return res.status(200).json({ status: "ok", message: "guest saved" });
      })
      .catch((err) => {
        if (
          [
            "SequelizeValidationError",
            "SequelizeUniqueConstraintError",
          ].includes(err.name)
        )
          err = err.errors[0].message;
        return res.status(412).json({ status: "fail", message: err });
      });
  } catch (err) {
    if (
      [
        "SequelizeUniqueConstraintError",
        "SequelizeValidationError",
        "ValidationErrorItem",
      ].includes(err.name)
    )
      err = err.errors[0].message;
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
        // offset: page * size,
        // limit: size,
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
            x.guestAnonymous === "ANONYMOUS" ? "ANONYMOUS" : x.guestFullName,
          guestIdNumber:
            x.guestAnonymous === "ANONYMOUS" ? "ANONYMOUS" : x.guestIdNumber,
          guestPhone:
            x.guestAnonymous === "ANONYMOUS" ? "ANONYMOUS" : x.guestPhone,
          comeFrom: x.guestAnonymous === "ANONYMOUS" ? "ANONYMOUS" : x.comeFrom,
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
        // totalPages: Math.ceil(result.count / size),
      });
    } else if (["HOST", "SECURITY OFFICER", "ADMIN"].includes(user.role)) {
      where = {
        visitStatus:
          visitStatus === "ALL"
            ? ["CANCELED", "PENDING", "IN", "OUT"]
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
        // visitStatus: "PENDING",
        gate: getUserGate.GateId,
      };
      let findGuest = await Guest.findOne({
        where,
        attributes: {
          exclude: [
            "gate",
            "HostId",
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
              exclude: ["createdAt", "updatedAt", "deletedAt"],
            },
          },
          {
            model: Host,
            required: false,
            attributes: {
              exclude: ["createdAt", "updatedAt", "deletedAt"],
            },
          },
          {
            model: Transport,
            required: false,
            attributes: {
              exclude: ["createdAt", "updatedAt", "deletedAt", "GuestId"],
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
              ? "ANONYMOUS"
              : findGuest.guestFullName,
          guestIdNumber:
            findGuest.guestAnonymous === "ANONYMOUS"
              ? "ANONYMOUS"
              : findGuest.guestIdNumber,
          guestPhone:
            findGuest.guestAnonymous === "ANONYMOUS"
              ? "ANONYMOUS"
              : findGuest.guestPhone,
          comeFrom:
            findGuest.guestAnonymous === "ANONYMOUS"
              ? "ANONYMOUS"
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
          Transports: findGuest.Transports,
        },
      });
    } else {
      // if()
      where = { randomReference: randomReference };
      let findGuest = await Guest.findOne({
        where,
        attributes: {
          exclude: [
            "gate",
            "HostId",
            "createdAt",
            "updatedAt",
            "deletedAt",
            "guestKeys",
            "id",
          ],
        },
        include: [
          {
            model: Gate,
            required: false,
            attributes: {
              exclude: ["createdAt", "updatedAt", "deletedAt"],
            },
          },
          {
            model: Host,
            required: false,
            attributes: {
              exclude: ["createdAt", "updatedAt", "deletedAt"],
            },
          },
          {
            model: Transport,
            required: false,
            attributes: {
              exclude: ["createdAt", "updatedAt", "deletedAt", "GuestId"],
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
    let { randomReference, visitStatus, date, time } = req.body;

    let where = { randomReference: randomReference };

    if (!randomReference || randomReference === null)
      throw "please enter random reference 😡";

    if (user.role === "GATE") {
      visitStatus = "IN";
      let getUserGate = await Account.findOne({
        where: { username: user.username, status: "ACTIVE" },
        attributes: ["GateId", "id"],
      });
      if (!getUserGate || getUserGate === null) throw "access denied 😡";
      where.gate = getUserGate.GateId;
      where.visitStatus = "PENDING";
    } else {
      if (
        !["CANCELED", "PENDING", "POSTPONED", "IN", "OUT"].includes(visitStatus)
      )
        throw "Invalid visit status 😡";
      if (visitStatus === "POSTPONED") {
        if (!date || date === "") throw "please enter guest visit date";
        if (!time || time === "") throw "please enter guest visit time";
        let tim = `${date} ${time}`;
        if (new Date(tim) - new Date() < 0)
          throw "guest arrival date can not be in past";
        visitStatus = "PENDING";
      }
    }
    let searchGuest = await Guest.findOne({ where });
    if (!searchGuest || searchGuest === null) throw "No guest found 🥺";
    searchGuest.update({ visitStatus: visitStatus });
    return res.status(200).json({
      status: "ok",
      message: `Guest visit status has been successfully changed to ${visitStatus} ✅`,
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

const guestSearch = async (req, res, next) => {
  try {
    let user = req.user.user;

    let where = "";
    let attributes = "";
    let { dateTo, dateFrom, key } = req.body;

    if (user.role === "GATE") {
      let getUserGate = await Account.findOne({
        where: { username: user.username, status: "ACTIVE" },
        attributes: ["GateId", "id"],
      });
      if (getUserGate) {
        where = {
          guestKeys: {
            [Op.or]: {
              [Op.like]: `%${key}%`,
              [Op.eq]: `${key}`,
              [Op.startsWith]: `${key},`,
              [Op.endsWith]: `,${key}`,
              [Op.substring]: `,${key},`,
            },
          },
          gate: getUserGate.GateId,
          date: { [Op.gte]: new Date() },
        };
      }
      let result = await Guest.findAll({
        where,
        attributes: {
          exclude: [
            "id",
            "gate",
            "HostId",
            "createdAt",
            "updatedAt",
            "deletedAt",
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

      let data = result.map((x) => {
        return {
          guestFullName:
            x.guestAnonymous === "ANONYMOUS" ? "ANONYMOUS" : x.guestFullName,
          guestIdNumber:
            x.guestAnonymous === "ANONYMOUS" ? "ANONYMOUS" : x.guestIdNumber,
          guestPhone:
            x.guestAnonymous === "ANONYMOUS" ? "ANONYMOUS" : x.guestPhone,
          comeFrom: x.guestAnonymous === "ANONYMOUS" ? "ANONYMOUS" : x.comeFrom,
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
      });
    } else if (["HOST", "SECURITY OFFICER", "ADMIN"].includes(user.role)) {
      if (key && dateFrom && dateTo) {
        where = {
          guestKeys: {
            [Op.or]: {
              [Op.like]: `%${key}%`,
              [Op.eq]: `${key}`,
              [Op.startsWith]: `${key},`,
              [Op.endsWith]: `,${key}`,
              [Op.substring]: `,${key},`,
            },
          },
          date: { [Op.between]: [dateFrom, dateTo] },
        };
      } else if (!key && dateFrom && dateTo && key !== null) {
        where = {
          date: { [Op.between]: [dateFrom, dateTo] },
        };
      } else if (key && dateFrom && !dateTo) {
        where = {
          guestKeys: {
            [Op.or]: {
              [Op.like]: `%${key}%`,
              [Op.eq]: `${key}`,
              [Op.startsWith]: `${key},`,
              [Op.endsWith]: `,${key}`,
              [Op.substring]: `,${key},`,
            },
          },
          date: { [Op.gte]: dateFrom },
        };
      } else if (key && !dateFrom && dateTo) {
        where = {
          guestKeys: {
            [Op.or]: {
              [Op.like]: `%${key}%`,
              [Op.eq]: `${key}`,
              [Op.startsWith]: `${key},`,
              [Op.endsWith]: `,${key}`,
              [Op.substring]: `,${key},`,
            },
          },
          date: { [Op.lte]: dateTo },
        };
      }
      // if(key && !dateFrom && !dateTo)
      let data = await Guest.findAll({
        where,
        attributes: {
          exclude: [
            "gate",
            "Hostid",
            "createdAt",
            "updatedAt",
            "deletedAt",
            "guestKeys",
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
const deleteGuest = async (req, res, next) => {
  try {
    let user = req.user.user;
    let { randomReference } = req.params;
    if (!["HOST", "ADMIN"].includes(user.role)) throw "Access denied 😡";

    if (!randomReference || randomReference === null)
      throw "random reference number is required";
    const findGuest = await Guest.findOne({
      where: {
        randomReference: randomReference,
        visitStatus: { [Op.ne]: "OUT" },
      },
    });

    if (!findGuest || findGuest === null) throw "No guest found 😡";
    findGuest.destroy();
    return res
      .status(200)
      .json({ status: "ok", message: "data was successfully deleted ✅" });
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
const deleteTransport = async (req, res) => {
  try {
    let user = req.user.user;

    let { id } = req.params;

    if (!id || id === null) throw "Transport id is required";

    if (!["HOST", "ADMIN"].includes(user.role)) throw "Access denied 😡";
    let findTransport = await Transport.findByPk(id);

    if (!findTransport || findTransport === null) throw "No Transport found";

    let findAllTransport = await Transport.count({
      where: { GuestId: findTransport.GuestId },
    });

    if (findAllTransport <= 1) throw "you can not delete all transport";

    findTransport.destroy({ force: true });

    return res
      .status(200)
      .json({ status: "ok", message: "Transport was successfully deleted" });
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

const addTransport = async (req, res) => {
  try {
    let user = req.user.user;

    if (!["HOST", "ADMIN"].includes(user.role)) throw "Access denied 😡";

    let dt = req.body;

    if (
      !dt.randomReference ||
      dt.randomReference === null ||
      (await Guest.count({
        where: {
          randomReference: dt.randomReference,
          visitStatus: { [Op.notIn]: ["IN", "OUT", "CANCELED"] },
        },
      })) === 0
    )
      throw "please enter correct guest randon reference key ";

    if (!dt.type || !["SELF DRIVING", "DRIVER", "UNKNOWN"].includes(dt.type))
      throw "Invalid transport type";

    if (
      ["SELF DRIVING", "DRIVER"].includes(dt.type) &&
      (!dt.plateNumber || dt.plateNumber === null)
    )
      throw "plate number is required";

    let guest = await Guest.findOne({
      where: {
        randomReference: dt.randomReference,
        visitStatus: { [Op.notIn]: ["OUT", "IN", "CANCELED"] },
      },
    });
    let obj = {
      transportType: dt.type,
      GuestId: guest.id,
    };
    if (["SELF DRIVING", "DRIVER"].includes(dt.type)) {
      if (
        dt.type === "DRIVER" &&
        (!dt.driverFullName || dt.driverFullName === null)
      )
        throw "driver full name is required";
      obj.plateNumber = dt.plateNumber;
      obj.vehicleColour = dt.vehicleColour || null;
      obj.vehicleModel = dt.vehicleModel || null;
      obj.driverFullName = dt.driverFullName || null;
      obj.driverNationId = dt.driverNationId || null;
      obj.driverPhoneNumber = dt.driverPhoneNumber || null;
    }
    let savedTransport = await Transport.create(obj);
    delete savedTransport.GuestId;
    return res.status(200).json({ status: "ok", data: savedTransport });
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

const updateGuest = async (req, res) => {
  try {
    let user = req.user.user;

    if (!["HOST", "ADMIN"].includes(user.role)) throw "Access denied 😡";

    for (const [key, value] of Object.entries(req.body)) {
      if (value === "undefined" || value === null || value.length === 0) {
        req.body[key] = null;
      }
    }

    let dt = req.body;

    if (!["VIP", "VVIP", "NORMAL", "SENIOR OFFICIAL"].includes(dt.guestStatus))
      throw "guest status is required";
    if (!dt.randomReference || dt.randomReference === null)
      throw "Please enter guest random reference key";
    let findGuest = await Guest.findOne({
      where: {
        randomReference: dt.randomReference,
        visitStatus: { [Op.notIn]: ["OUT"] },
      },
    });

    if (!findGuest || findGuest === null) throw "No guest found 🥵";

    if (!dt.date || dt.date === "") throw "please enter guest visit date";
    if (!dt.time || dt.time === "") throw "please enter guest visit time";
    let tim = `${dt.date} ${dt.time}`;
    if (new Date(tim) - new Date() < 0)
      throw "guest arrival date can not be in past";

    if (!dt.gate || (await Gate.count({ where: { id: dt.gate } })) === 0)
      throw "Please select correct gate";
    if (!dt.HostId || (await Host.count({ where: { id: dt.HostId } })) === 0)
      throw "Please select correct host";
    if (
      dt.guestAnonymous &&
      !["ANONYMOUS", "NORMAL"].includes(dt.guestAnonymous)
    )
      throw "Invalid guest anonymous";
    if (
      dt.guestStatus &&
      !["VIP", "VVIP", "NORMAL", "SENIOR OFFICIAL"].includes(dt.guestStatus)
    )
      throw "Invalid guest Status";
    if (
      dt.visitStatus &&
      !["PENDING", "IN", "OUT", "CANCELED", "POSTPONED"].includes(
        dt.visitStatus
      )
    )
      throw "Invalid guest visit Status";
    findGuest.update(dt);
    return res
      .status(200)
      .json({ status: "ok", message: "Guest was succesfully updated" });
  } catch (err) {
    console.log(err);

    if (["SequelizeUniqueConstraintError"].includes(err.name)) {
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
const updateTransport = async (req, res) => {
  try {
    let user = req.user.user;

    if (!["HOST", "ADMIN"].includes(user.role)) throw "Access denied 😡";

    for (const [key, value] of Object.entries(req.body)) {
      if (value === "undefined" || value === null || value.length === 0) {
        req.body[key] = null;
      }
    }

    let dt = req.body;

    if (!dt.id || dt.id === null) throw "Please enter valid id 🥵";

    if (!dt.type || !["SELF DRIVING", "DRIVER", "UNKNOWN"].includes(dt.type))
      throw "Invalid transport type";

    if (
      ["SELF DRIVING", "DRIVER"].includes(dt.type) &&
      (!dt.plateNumber || dt.plateNumber === null)
    )
      throw "plate number is required";

    let findTransport = await Transport.findOne({
      where: {
        id: dt.id,
      },
      include: {
        model: Guest,
        required: true,
        where: { visitStatus: { [Op.notIn]: ["IN", "OUT", "CANCELED"] } },
        attributes: ["randomReference", "visitStatus"],
      },
    });
    let obj = {
      transportType: dt.type,
      plateNumber: null,
      vehicleColour: null,
      vehicleModel: null,
      driverFullName: null,
      driverNationId: null,
      driverPhoneNumber: null,
    };
    if (["SELF DRIVING", "DRIVER"].includes(dt.type)) {
      if (
        dt.type === "DRIVER" &&
        (!dt.driverFullName || dt.driverFullName === null)
      )
        throw "driver full name is required";
      obj.plateNumber = dt.plateNumber;
      obj.vehicleColour = dt.vehicleColour || null;
      obj.vehicleModel = dt.vehicleModel || null;
      obj.driverFullName = dt.driverFullName || null;
      obj.driverNationId = dt.driverNationId || null;
      obj.driverPhoneNumber = dt.driverPhoneNumber || null;
    }

    let savedTransport = findTransport.update(obj, { where: { id: dt.id } });

    return res
      .status(200)
      .json({ status: "ok", data: "transport was updated" });
  } catch (err) {
    console.log(err);

    if (["SequelizeUniqueConstraintError"].includes(err.name)) {
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
module.exports = {
  createGuest,
  findAll,
  updateVisitStatus,
  getGuest,
  guestSearch,
  deleteGuest,
  deleteTransport,
  addTransport,
  updateGuest,
  updateTransport,
};
