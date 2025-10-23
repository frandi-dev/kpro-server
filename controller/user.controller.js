const {
  createUserScema,
  loginUserScema,
  userIdScema,
  updateUserScema,
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

// get all user
const getAllUser = async (req, res, next) => {
  try {
    const users = await db.users.findMany({
      select: {
        id: true,
        username: true,
        is_online: true,
        role: true,
      },
      orderBy: {
        id: "asc",
      },
    });
    res.status(statuscode.Ok).json({
      message: "Successful",
      data: users,
      error: false,
    });
  } catch (error) {
    next(error);
  }
};

// update user
const updateUser = async (req, res, next) => {
  try {
    const request = validate(updateUserScema, {
      id: parseInt(req.params.id),
      ...req.body,
    });

    const user = await db.users.findUnique({
      where: { id: request.id },
      select: {
        role: true,
      },
    });

    if (!user) {
      throw new ResponseError(statuscode.NotFound, "User not found.");
    }

    const data = {};
    if (request.password) {
      data.password = await bcrypt.hash(request.password, 10);
    }

    if (request.username) {
      data.username = request.username;
    }

    if (request.role) {
      data.role = request.role;
    } else {
      data.role = user.role;
    }

    // masuk data
    await db.users.update({
      data,
      where: {
        id: request.id,
      },
    });

    res.status(statuscode.Ok).json({
      message: "User updated Successful",
      data,
      error: false,
    });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const id = validate(userIdScema, parseInt(req.params.id));

    // cek user
    const count = await db.users.count({
      where: {
        id,
      },
    });

    if (count === 0) {
      throw new ResponseError(statuscode.NotFound, "User not found.");
    }

    await db.users.delete({ where: { id } });

    res.status(statuscode.Ok).json({
      message: "User deleted Successful",
      data: null,
      error: false,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createUser,
  login,
  logout,
  getUserById,
  getAllUser,
  updateUser,
  deleteUser,
};
