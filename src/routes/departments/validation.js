const Joi = require("joi");

const addPostStatus = (data) => {
  const schema = Joi.object({
    "status-en": Joi.string().required(),
    "status-ar": Joi.string().required(),
  });

  return schema.validate(data);
};

module.exports.addPostStatus = addPostStatus;
