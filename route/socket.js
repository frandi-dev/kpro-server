const db = require("../utils/db");
const ResponseError = require("../utils/response-error");
const statuscode = require("../utils/statuscode");
const validate = require("../validation");
const { userIdScema } = require("../validation/user.scema");

const connection = (socket) => {
  console.log("Client connected: ", socket.id);

  // set online user jadi false ketika disconect
  socket.on("disconnect", disconect);
  socket.on("user_online", userOnline);
};

// set online realtime
const userOnline = async (userID) => {
  const id = validate(userIdScema, parseInt(userID));

  const user = await db.users.findUnique({
    where: { id },
  });

  if (!user) {
    throw new ResponseError(statuscode.NotFound, "User not found.");
  }

  if (!user.is_online) {
    await db.users.update({
      where: {
        id,
      },
      data: {
        is_online: true,
      },
    });
  }

  socket.data.id = id;
  console.log(`User ${id} is now online!`);
};

//  handler socket io untuk set status online menjadi false ketika user disconnect
const disconect = async () => {
  const id = validate(userIdScema, parseInt(socket.data.id));

  await db.users.update({
    where: { id },
    data: {
      is_online: false,
    },
  });

  console.log(`User ${id} disconnected!`);
};

module.exports = { connection };
