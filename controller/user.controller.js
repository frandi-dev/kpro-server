const { createUserScema } = require("../validation/user.scema");
const validate = require("../validation");
const db = require("../utils/db");
const ResponseError = require("../utils/response-error");
const statuscode = require("../utils/statuscode");
const bcrypt = require("bcrypt");

// create new user
const createUser = async (req, res, next) => {
  try {
    const request = validate(createUserScema, req.body);

    // cek apa user sudah terdaftar
    const userCount = await db.users.count({
      where: { username: request.username },
    });

    if (userCount > 0) {
      throw new ResponseError(
        statuscode.BadRequest,
        "Username is already exist."
      );
    }

    // encripsi password
    const hasPass = await bcrypt.hash(request.password, 10);

    const user = await db.users.create({
      data: {
        username: request.username,
        password: hasPass,
        role: request.role,
      },
    });

    res.status(statuscode.Created).json({
      message: "User successfully created",
      data: null,
      error: false,
    });
  } catch (error) {
    next(error);
  }
};

// login user
const login = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

module.exports = { createUser };
