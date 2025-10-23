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

module.exports = { createUserScema, loginUserScema, userIdScema };
