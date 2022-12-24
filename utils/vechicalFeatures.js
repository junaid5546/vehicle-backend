const path_secquence = (name) => {
  if (name === "Fuel") {
    return "fuel";
  } else if (name === "Origin") {
    return "origin";
  } else if (name === "Insurance") {
    return "car_insurance";
  } else if (name === "Seats") {
    return "seats";
  } else if (name === "Transmission") {
    return "transmission";
  } else if (name === "Condition") {
    return "condition";
  } else if (name === "Sale Type") {
    return "sale_type";
  } else if (name === "Cylinders") {
    return "cylinder_count";
  } else if (name === "Drivetrain") {
    return "car_drivetrain_type";
  } else if (name === "Driving Readiness") {
    return "driving_readiness";
  } else if (name === "Distance Travelled") {
    return "car_distance_travelled";
  } else if (name === "Plate") {
    return "plate_type";
  } else if (name === "Warranty Duration") {
    return "car_warranty_duration";
  } else if (name === "Warranty Kilometer") {
    return "car_warranty_kilometer";
  } else if (name === "Location") {
    return "car_location";
  } else if (name === "Seats") {
    return "seats";
  } else if (name === "Interior Color") {
    return "interior_color";
  } else if (name === "Exterior Color") {
    return "exterior_color";
  } else if (name === "Engine Size") {
    return "engine_size";
  } else if (name === "Model Year") {
    return "year";
  } else if (name === "Doors") {
    return "door";
  } else {
    return;
  }
};

module.exports.path_secquence = path_secquence;
