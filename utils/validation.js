const Joi = require("joi");

const userSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const userUpdateSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  email: Joi.string().email(),
  password: Joi.string().min(6),
}).min(1);

// ✅ NEW: Login validation
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const validateUser = (data) => {
  return userSchema.validate(data);
};

const validateUserUpdate = (data) => {
  return userUpdateSchema.validate(data);
};

// ✅ NEW: Login validation
const validateLogin = (data) => {
  return loginSchema.validate(data);
};

module.exports = { validateUser, validateUserUpdate, validateLogin };
