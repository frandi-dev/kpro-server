const express = require("express");
const cors = require("cors");

const API_PREFIX_URL = process.env.API_PREFIX_URL;

const app = express();
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

app.use(`/api/users`, require("./user.route"));
app.use(require("../middleware/error-middleware"));

module.exports = { app };
