const Joi = require("joi");

const createRoomScema = Joi.object({
  name: Joi.string().max(20).required(),
  price_per_hour: Joi.number().integer().required(),
});

module.exports = { createRoomScema };
