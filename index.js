const { app, server } = require("./route");
const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT || 3000;
server.listen(PORT, () =>
  console.log(`KPro backend running on port http://localhost:${PORT}`)
);
