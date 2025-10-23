const Joi = require("joi");

const createUserScema = Joi.object({
  username: Joi.string().min(3).max(50).required(),
  password: Joi.string().required(),
  role: Joi.string().valid("admin", "cashier", "waiter"),
});

const loginUserScema = Joi.object({
  username: Joi.string().min(3).max(50).required(),
  password: Joi.string().required(),
});

const userIdScema = Joi.number().integer().required();

const updateUserScema = Joi.object({
  id: Joi.number().integer().required(),
  username: Joi.string().min(3).max(50).optional(),
  password: Joi.string().optional(),
  role: Joi.string().valid("admin", "cashier", "waiter").optional(),
});

module.exports = {
  createUserScema,
  loginUserScema,
  userIdScema,
  updateUserScema,
};
