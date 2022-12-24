const Joi = require("joi");

const registerValidation = (data) => {
  const schema = Joi.object({
    first_name: Joi.string().min(2).max(15).required(),
    last_name: Joi.string().min(2).max(15).required(),
    primary_phone: Joi.object()
      .pattern(
        /^/,
        Joi.alternatives().try(
          Joi.number().allow(null),
          Joi.number().allow(null)
        )
      )
      .allow(null),
    secondary_phone: Joi.object()
      .pattern(
        /^/,
        Joi.alternatives().try(
          Joi.number().allow(null),
          Joi.number().allow(null)
        )
      )
      .allow(null),
    dob: Joi.number().required(),
  });

  return schema.validate(data);
};

const loginValidation = (data) => {
  const schema = Joi.object({
    phone: Joi.object().pattern(
      /^/,
      Joi.alternatives().try(Joi.number(), Joi.number())
    ),
    dob: Joi.number().required(),
  });

  return schema.validate(data);
};

const addGovValidation = (data) => {
  const schema = Joi.object({
    gov_name_en: Joi.string().required(),
    gov_name_ar: Joi.string().required(),
  });

  return schema.validate(data);
};

const addSatetValidation = (date) => {
  const schema = Joi.object({
    _id: Joi.string().required(),
    state_name_en: Joi.string().required(),
    state_name_ar: Joi.string().required(),
  });

  return schema.validate(date);
};

const addPostLevelSingle = (date) => {
  const schema = Joi.object({
    post_type: Joi.string(),
    order_number: Joi.number(),
    level_en: Joi.string(),
    level_ar: Joi.string(),
    level_duration_en: Joi.string(),
    level_duration_ar: Joi.string(),
    level_price: Joi.number(),
    levelDuration: Joi.number(),
    plan_id: Joi.string(),
  });

  return schema.validate(date);
};

const updatePostLevelSingle = (date) => {
  const schema = Joi.object({
    _id: Joi.string(),
    post_type: Joi.string(),
    order_number: Joi.number(),
    level_en: Joi.string(),
    level_ar: Joi.string(),
    level_duration_en: Joi.string(),
    level_duration_ar: Joi.string(),
    level_price: Joi.number(),
    levelImg: Joi.string(),
  });

  return schema.validate(date);
};

const addVehicleFilterValidation = (date) => {
  const schema = Joi.object({
    filter_name_en: Joi.string().required(),
    filter_name_ar: Joi.string().required(),
  });

  return schema.validate(date);
};

const message = (name) => {
  return {
    "string.base": `${name} should be a type of 'text'`,
    "string.empty": `${name} cannot be an empty field`,
    "any.required": `${name} is a required field`,
  };
};

const updateVehicleForSaleValidation = (val) => {
  const schema = Joi.object({
    body_id: Joi.string()
      .required("body is required")
      .messages(message("Body")),
    condition_id: Joi.string().required().messages(message("Condition")),
    cylinder_count_id: Joi.string()
      .required()
      .messages(message("Cylinder Count")),
    door_count_id: Joi.number().required().messages(message("Door Count")),
    drivetrain_id: Joi.string().required().messages(message("Drivetrain")),
    engine_size: Joi.number().required().messages(message("Engine Size")),
    exterior_color_id: Joi.string()
      .required()
      .messages(message("Exterior Color")),
    features_id_array: Joi.array().required().messages(message("Features")),
    fuel_type_id: Joi.string().required().messages(message("Fuel Type")),
    governorate_id: Joi.string().required().messages(message("Governorate")),
    insurance_type_id: Joi.string()
      .required()
      .messages(message("Insurance Type")),
    interior_color_id: Joi.string()
      .required()
      .messages(message("Interior Color")),
    post_type: Joi.object().required().messages(message("post  type")),
    make_id: Joi.string().required().messages(message("Make")),
    model_id: Joi.string().required().messages(message("Model")),
    origin_id: Joi.string().required().messages(message("Origin")),
    plate_type_id: Joi.string().required().messages(message("Plate Type")),
    readiness_id: Joi.string().required().messages(message("Readiness")),
    sale_type_id: Joi.string().required().messages(message("Sale Type")),
    seats_type_id: Joi.string().required().messages(message("Seats Type")),
    state_id: Joi.string().required().messages(message("State")),
    transmission_type_id: Joi.string()
      .required()
      .messages(message("Transmission Type")),
    trim_id: Joi.string().required().messages(message("Trim")),
    warranty_duration_id: Joi.string()
      .required()
      .messages(message("Warranty Duration")),
    year_id: Joi.string().required().messages(message("Year")),
    warranty_kilometer: Joi.string()
      .required()
      .messages(message("Warranty Kilometer")),
    distance_kilometer: Joi.number()
      .required()
      .messages(message("Distance Kilometer")),
    distance_mile: Joi.number().required().messages(message("Distance Miles")),
    price: Joi.number().required().messages(message("Price")),
    vin: Joi.string().messages(message("Vin")),
    primary_phone: Joi.string().required().messages(message("Primary Phone")),
    seller_notes: Joi.string().required().messages(message("Seller Notes")),
    post_status: Joi.string().messages(message("Status")),
  });

  return schema.validate(val);
};

const addVehicleFilterTypeValidation = (date) => {
  const schema = Joi.object({
    _id: Joi.string().required(),
    type_name_en: Joi.string().required(),
    type_name_ar: Joi.string().required(),
  });

  return schema.validate(date);
};

const updateVehicleFilterValidation = (date) => {
  const schema = Joi.object({
    _id: Joi.string().required(),
    nameEn: Joi.string().required(),
    nameAr: Joi.string().required(),
  });

  return schema.validate(date);
};

const upadteVehicleFilterTypeValidation = (date) => {
  const schema = Joi.object({
    _id: Joi.string().required(),
    filterId: Joi.string().required(),
    nameEn: Joi.string().required(),
    nameAr: Joi.string().required(),
  });

  return schema.validate(date);
};

const addReportReason = (data) => {
  const schema = Joi.object({
    report_reason_en: Joi.string().required(),
    report_reason_ar: Joi.string().required(),
  });

  return schema.validate(data);
};

const updateReportReason = (data) => {
  const schema = Joi.object({
    _id: Joi.string().required(),
    report_reason_en: Joi.string(),
    report_reason_ar: Joi.string(),
  });

  return schema.validate(data);
};

const createReport = (data) => {
  const Schema = Joi.object({
    reportedBy: Joi.string().required(),
    postId: Joi.string().required(),
    reasonId: Joi.string().required(),
  });

  return Schema.validate(data);
};

const addVehicleMake = (data) => {
  const Schema = Joi.object({
    make_en: Joi.string().required(),
    make_ar: Joi.string().required(),
  });

  return Schema.validate(data);
};

const addVehicleModel = (data) => {
  const Schema = Joi.object({
    make_id: Joi.string().required(),
    model_en: Joi.string().required(),
    model_ar: Joi.string().required(),
  });

  return Schema.validate(data);
};

const addVehicleTrim = (data) => {
  const Schema = Joi.object({
    model_id: Joi.string().required(),
    trim_en: Joi.string().required(),
    trim_ar: Joi.string().required(),
    body_id: Joi.array().min(1),
    engine_size: Joi.array().min(1),
  });

  return Schema.validate(data);
};

const addVehicleNumberPost = (data) => {
  const Schema = Joi.object({
    userId: Joi.string().required(),
    vehicleNumber: Joi.number().required(),
    vehicleLetterId: Joi.string().required(),
    plateTypeId: Joi.string().required(),
    transferTypeId: Joi.string().required(),
    governorateId: Joi.string().required(),
    stateId: Joi.string().required(),
    price: Joi.number().required(),
    postStatus: Joi.string().required(),
  });

  return Schema.validate(data);
};

module.exports.addVehicleNumberPost = addVehicleNumberPost;
module.exports.addVehicleTrim = addVehicleTrim;
module.exports.addVehicleModel = addVehicleModel;
module.exports.addVehicleMake = addVehicleMake;
module.exports.createReport = createReport;
module.exports.updateReportReason = updateReportReason;
module.exports.addReportReason = addReportReason;
module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.addGovValidation = addGovValidation;
module.exports.addSatetValidation = addSatetValidation;
module.exports.addPostLevelSingle = addPostLevelSingle;
module.exports.updatePostLevelSingle = updatePostLevelSingle;
module.exports.addVehicleFilterValidation = addVehicleFilterValidation;
module.exports.addVehicleFilterTypeValidation = addVehicleFilterTypeValidation;
module.exports.updateVehicleFilterValidation = updateVehicleFilterValidation;
module.exports.updateVehicleForSaleValidation = updateVehicleForSaleValidation;
module.exports.upadteVehicleFilterTypeValidation =
  upadteVehicleFilterTypeValidation;
