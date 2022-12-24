const Joi = require("joi");

const validate = (keyType, error, actualType, message, keyName) => {
  if (keyType !== actualType) {
    error == true;
    message = `${keyName} must be ${actualType}`;
  } else return;
};
const registerValidation = (data) => {
  const schema = Joi.object({
    first_name: Joi.string().min(2).max(15).required(),
    last_name: Joi.string().min(2).max(15).required(),
    accountType: Joi.string(),
    primary_phone: Joi.object()
      .pattern(
        /^/,
        Joi.alternatives().try(
          Joi.number().allow(null),
          Joi.number().allow(null)
        )
      )
      .allow(null),

    dob: Joi.string(),
  });

  return schema.validate(data);
};

const loginValidation = (data) => {
  const schema = Joi.object({
    phone: Joi.object().pattern(
      /^/,
      Joi.alternatives().try(Joi.number(), Joi.number())
    ),
    dob: Joi.string(),
  });

  return schema.validate(data);
};

const update_user = async (body, error, message) => {
  if (body.userpublicId) {
    validate(
      typeof body.userpublicId,
      error,
      Number,
      message,
      `${body.userpublicId}`
    );
  }
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.update_user = update_user;
