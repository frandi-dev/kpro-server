const db = require("../utils/db");
const ResponseError = require("../utils/response-error");
const statuscode = require("../utils/statuscode");
const validate = require("../validation");
const { createRoomScema } = require("../validation/room.scema");

const createRoom = async (req, res, next) => {
  try {
    const request = validate(createRoomScema, req.body);
    const room = await db.rooms.count({
      where: {
        name: request.name,
      },
    });

    if (room > 0) {
      throw new ResponseError(statuscode.BadRequest, "Room already exist.");
    }

    await db.rooms.create({
      data: {
        name: request.name,
        price_per_hour: request.price_per_hour,
      },
    });

    res.status(statuscode.Created).json({
      message: "Room successfully created",
      data: null,
      error: false,
    });
  } catch (error) {
    next(error);
  }
};

const getAllRoom = async (req, res, next) => {
  try {
    const rooms = await db.rooms.findMany({
      orderBy: {
        name: "asc",
      },
    });

    res.status(statuscode.Created).json({
      message: "Successfull",
      data: rooms,
      error: false,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createRoom, getAllRoom };
