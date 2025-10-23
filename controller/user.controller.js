const {
  createUserScema,
  loginUserScema,
  userIdScema,
} = require("../validation/user.scema");
const validate = require("../validation");
const db = require("../utils/db");
const ResponseError = require("../utils/response-error");
const statuscode = require("../utils/statuscode");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// create new user
const createUser = async (req, res, next) => {
  try {
    // cek user role
    // hanya admin yang boleh membuat user baru
    const role = req.user.role;
    if (role !== "admin") {
      throw new ResponseError(
        statuscode.BadRequest,
        "Only admins can create new users"
      );
    }

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
    const request = validate(loginUserScema, req.body);

    // cek apa user ada
    const user = await db.users.findUnique({
      where: { username: request.username },
    });
    if (!user) {
      throw new ResponseError(
        statuscode.NotFound,
        "Username or password wrong."
      );
    }

    // cek password
    const matchPass = await bcrypt.compare(request.password, user.password);
    if (!matchPass) {
      throw new ResponseError(
        statuscode.BadRequest,
        "Username or password wrong."
      );
    }

    // register token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_LIMIT || "1d" }
    );

    // update user
    const data = await db.users.update({
      where: { id: user.id },
      data: {
        is_online: true,
      },
      select: {
        username: true,
        is_online: true,
        role: true,
      },
    });

    res.status(statuscode.Ok).json({
      message: "Login successful",
      data,
      token,
      error: false,
    });
  } catch (error) {
    next(error);
  }
};

// logout
const logout = async (req, res, next) => {
  try {
    const id = req.user.id;

    // update dari online ke offline
    await db.users.update({
      where: { id },
      data: {
        is_online: false,
      },
    });

    res.status(statuscode.Ok).json({
      message: "Logout successful",
      data: null,
      error: false,
    });
  } catch (error) {
    next(error);
  }
};

// ===== CRUD USER =====

//get user by id
const getUserById = async (req, res, next) => {
  try {
    // cek user role
    // hanya admin yang boleh membuat user baru
    const role = req.user.role;
    if (role !== "admin") {
      throw new ResponseError(
        statuscode.BadRequest,
        "Only admins can create new users"
      );
    }

    const id = validate(userIdScema, parseInt(req.params.id));
    const user = await db.users.findUnique({ where: { id } });
    if (!user) {
      throw new ResponseError(statuscode.NotFound, "User not found.");
    }

    res.status(statuscode.Ok).json({
      message: "Successful",
      data: user,
      error: false,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createUser, login, logout, getUserById };
