const route = require("express").Router();
const userController = require("../controller/user.controller");
const { authorization } = require("../middleware/auth-middleware");

route.post("/", authorization, userController.createUser);
route.post("/login", userController.login);
route.post("/logout", authorization, userController.logout);
route.get("/:id", authorization, userController.getUserById);

module.exports = route;
