const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  console.log("ok");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`KPro backend running on port http://localhost:${PORT}`)
);
