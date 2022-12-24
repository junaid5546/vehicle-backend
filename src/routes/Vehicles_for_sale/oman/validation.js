const Joi = require("joi");

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
    door_count_id: Joi.string().required().messages(message("Door Count")),
    drivetrain_id: Joi.string().required().messages(message("Drivetrain")),
    engine_size: Joi.string().required().messages(message("Engine Size")),
    exterior_color_id: Joi.string()
      .required()
      .messages(message("Exterior Color")),
    features_id_array: Joi.array().messages(message("Features")),
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
    warranty_duration_id: Joi.string().messages(message("Warranty Duration")),
    year_id: Joi.string().required().messages(message("Year")),
    warranty_kilometer: Joi.string(),
    distance_kilometer: Joi.number(),
    distance_mile: Joi.number(),
    price: Joi.number().required().messages(message("Price")),
    vin: Joi.string().messages(message("Vin")),
    // primary_phone: Joi.string(),
    seller_notes: Joi.string().allow(""),
    post_status: Joi.string().messages(message("Status")),
  });

  return schema.validate(val);
};

const updateVehicleForSaleValidationDash = (val) => {
  const schema = Joi.object({
    body_id: Joi.string().messages(message("Body")),
    condition_id: Joi.string().messages(message("Condition")),
    cylinder_count_id: Joi.string()().messages(message("Cylinder Count")),
    door_count_id: Joi.string().messages(message("Door Count")),
    drivetrain_id: Joi.string().messages(message("Drivetrain")),
    engine_size: Joi.string().messages(message("Engine Size")),
    exterior_color_id: Joi.string()().messages(message("Exterior Color")),
    fuel_type_id: Joi.string().messages(message("Fuel Type")),

    interior_color_id: Joi.string()().messages(message("Interior Color")),
    post_type: Joi.object().messages(message("post  type")),
    make_id: Joi.string().messages(message("Make")),
    model_id: Joi.string().messages(message("Model")),
    origin_id: Joi.string().messages(message("Origin")),
    plate_type_id: Joi.string().messages(message("Plate Type")),
    readiness_id: Joi.string().messages(message("Readiness")),
    seats_type_id: Joi.string().messages(message("Seats Type")),
    transmission_type_id: Joi.string()().messages(message("Transmission Type")),
    trim_id: Joi.string().messages(message("Trim")),
    year_id: Joi.string().messages(message("Year")),
    price: Joi.any().messages(message("Price")),
    seller_notes: Joi.string().allow(""),
    post_status: Joi.string().messages(message("Status")),
  });

  return schema.validate(val);
};

const updateVehicleForSaleValidationForUpload = (val) => {
  const schema = Joi.object({
    body_id: Joi.string()
      .required("body is required")
      .messages(message("Body")),
    condition_id: Joi.string().required().messages(message("Condition")),
    cylinder_count_id: Joi.string()
      .required()
      .messages(message("Cylinder Count")),
    door_count_id: Joi.string().required().messages(message("Door Count")),
    drivetrain_id: Joi.string().required().messages(message("Drivetrain")),
    engine_size: Joi.string().required().messages(message("Engine Size")),
    exterior_color_id: Joi.string()
      .required()
      .messages(message("Exterior Color")),
    features_id_array: Joi.array().messages(message("Features")),
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
    seller_notes: Joi.string().allow(""),
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

module.exports.addVehicleTrim = addVehicleTrim;
module.exports.addVehicleModel = addVehicleModel;
module.exports.addVehicleMake = addVehicleMake;
module.exports.addReportReason = addReportReason;
module.exports.addVehicleFilterValidation = addVehicleFilterValidation;
module.exports.addVehicleFilterTypeValidation = addVehicleFilterTypeValidation;
module.exports.updateVehicleFilterValidation = updateVehicleFilterValidation;
module.exports.updateVehicleForSaleValidation = updateVehicleForSaleValidation;
module.exports.upadteVehicleFilterTypeValidation =
  updateVehicleForSaleValidationForUpload;

module.exports.updateVehicleForSaleValidationDash =
  updateVehicleForSaleValidationForUpload;
module.exports.updateVehicleForSaleValidationDash =
  updateVehicleForSaleValidationDash;
