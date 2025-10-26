const route = require("express").Router();
const { authorization, authrole } = require("../middleware/auth-middleware");
const roomController = require("../controller/room.controller");

route.post("/", authorization, authrole(["admin"]), roomController.createRoom);
route.delete(
  "/:name",
  authorization,
  authrole(["admin"]),
  roomController.deleteRoomByName
);

route.get("/", authorization, roomController.getAllRoom);

module.exports = route;
