const Joi = require("joi");

const createUserScema = Joi.object({
  username: Joi.string().min(3).max(50).required(),
  password: Joi.string().required(),
  role: Joi.string().valid("admin", "cashier", "waiter"),
});

module.exports = { createUserScema };
