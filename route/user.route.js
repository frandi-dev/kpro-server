const route = require("express").Router();
const userController = require("../controller/user.controller");

route.post("/", userController.createUser);

module.exports = route;
