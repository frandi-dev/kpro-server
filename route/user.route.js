const route = require("express").Router();
const userController = require("../controller/user.controller");
const { authorization, authrole } = require("../middleware/auth-middleware");

route.post("/", authorization, authrole(["admin"]), userController.createUser);
route.get(
  "/:id",
  authorization,
  authrole(["admin"]),
  userController.getUserById
);
route.get("/", authorization, authrole(["admin"]), userController.getAllUser);
route.patch(
  "/:id",
  authorization,
  authrole(["admin"]),
  userController.updateUser
);

route.delete(
  "/:id",
  authorization,
  authrole(["admin"]),
  userController.deleteUser
);

route.post("/login", userController.login);
route.post("/logout", authorization, userController.logout);

module.exports = route;
