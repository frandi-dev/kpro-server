const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");
const { connection } = require("./socket");

const API_PREFIX_URL = process.env.API_PREFIX_URL;

const app = express();
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", connection);

app.use(`/api/users`, require("./user.route"));
app.use("/api/rooms", require("./room.route"));
app.use(require("../middleware/error-middleware"));

module.exports = { app, server };
