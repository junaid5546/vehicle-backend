var _ = require("lodash");
const ObjectId = require("mongoose").Types.ObjectId;

const structureQ = (body) => {
  const searchObj = {};
  if (body) {
    if (body?.body) {
      const values = body?.body?.map((e) => ObjectId(e));
      searchObj.body_id = {
        $in: values,
      };
    }
    if (body?.door) {
      const values = body?.door?.map((e) => ObjectId(e));
      searchObj.door_count_id = {
        $in: values,
      };
    }
    if (body?.cylinder_count) {
      const values = body?.cylinder_count?.map((e) => ObjectId(e));
      searchObj.cylinder_count_id = {
        $in: values,
      };
    }
    if (body?.interior_color) {
      const values = body?.interior_color?.map((e) => ObjectId(e));
      searchObj.interior_color_id = {
        $in: values,
      };
    }

    if (body?.condition) {
      const values = body?.condition?.map((e) => ObjectId(e));
      searchObj.condition_id = {
        $in: values,
      };
    }

    if (body?.exterior_color) {
      const values = body?.exterior_color?.map((e) => ObjectId(e));
      searchObj.exterior_color_id = {
        $in: values,
      };
    }

    if (body?.year) {
      const values = body?.year?.map((e) => ObjectId(e));
      searchObj.year_id = {
        $in: values,
      };
    }

    if (body?.trim) {
      const values = body?.trim?.map((e) => ObjectId(e));
      searchObj.trim_id = {
        $in: values,
      };
    }

    if (body?.make) {
      const values = body?.make?.map((e) => ObjectId(e));
      searchObj.make_id = {
        $in: values,
      };
    }

    if (body?.model) {
      const values = body?.model?.map((e) => ObjectId(e));
      searchObj.model_id = {
        $in: values,
      };
    }

    if (body?.origin) {
      const values = body?.origin?.map((e) => ObjectId(e));
      searchObj.origin_id = {
        $in: values,
      };
    }

    if (body?.plate) {
      const values = body?.plate?.map((e) => ObjectId(e));
      searchObj.plate_type_id = {
        $in: values,
      };
    }

    if (body?.sale_type) {
      const values = body?.sale_type?.map((e) => ObjectId(e));
      searchObj.sale_type_id = {
        $in: values,
      };
    }

    if (body?.state) {
      const values = body?.state?.map((e) => ObjectId(e));
      searchObj.state_id = {
        $in: values,
      };
    }

    if (body?.transmission) {
      const values = body?.transmission?.map((e) => ObjectId(e));
      searchObj.transmission_type_id = {
        $in: values,
      };
    }

    if (body?.warranty_duration) {
      const values = body?.warranty_duration?.map((e) => ObjectId(e));
      searchObj.warranty_duration_id = {
        $in: values,
      };
    }

    if (body?.state) {
      const values = body?.state?.map((e) => ObjectId(e));
      searchObj.state_id = {
        $in: values,
      };
    }

    if (body?.seats) {
      const values = body?.seats?.map((e) => ObjectId(e));
      searchObj.seats_type_id = {
        $in: values,
      };
    }

    if (body?.readiness) {
      const values = body?.readiness?.map((e) => ObjectId(e));
      searchObj.readiness_id = {
        $in: values,
      };
    }

    if (body?.governorate) {
      const values = body?.governorate?.map((e) => ObjectId(e));
      searchObj.governorate_id = {
        $in: values,
      };
    }

    if (body?.fuel) {
      const values = body?.fuel?.map((e) => ObjectId(e));
      searchObj.fuel_type_id = {
        $in: values,
      };
    }

    if (body?.drivetrain) {
      const values = body?.drivetrain?.map((e) => ObjectId(e));
      searchObj.drivetrain_id = {
        $in: values,
      };
    }

    if (body?.engine_size) {
      const values = body?.engine_size?.map((e) => ObjectId(e));
      searchObj.engine_size = {
        $in: values,
      };
    }
    if (body?.car_location) {
      const values = body?.car_location?.map((e) => ObjectId(e));
      searchObj.governorate_id = {
        $in: values,
      };
      searchObj.state_id = {
        $in: values,
      };
    }
  } else {
    return;
  }

  return searchObj;
};

const exclude = (body) => {
  const searchObj = {};
  if (body?.body) {
    const values = body?.body?.map((e) => ObjectId(e));
    searchObj.body_id = {
      $nin: values,
    };
  }
  if (body?.door) {
    const values = body?.door?.map((e) => ObjectId(e));
    searchObj.door_count_id = {
      $nin: values,
    };
  }
  if (body?.cylinder_count) {
    const values = body?.cylinder_count?.map((e) => ObjectId(e));
    searchObj.cylinder_count_id = {
      $nin: values,
    };
  }
  if (body?.interior_color) {
    const values = body?.interior_color?.map((e) => ObjectId(e));
    searchObj.interior_color_id = {
      $nin: values,
    };
  }

  if (body?.condition) {
    const values = body?.condition?.map((e) => ObjectId(e));
    searchObj.condition_id = {
      $nin: values,
    };
  }

  if (body?.exterior_color) {
    const values = body?.exterior_color?.map((e) => ObjectId(e));
    searchObj.exterior_color_id = {
      $nin: values,
    };
  }

  if (body?.year) {
    const values = body?.year?.map((e) => ObjectId(e));
    searchObj.year_id = {
      $nin: values,
    };
  }

  if (body?.trim) {
    const values = body?.trim?.map((e) => ObjectId(e));
    searchObj.trim_id = {
      $nin: values,
    };
  }

  if (body?.make) {
    const values = body?.make?.map((e) => ObjectId(e));
    searchObj.make_id = {
      $nin: values,
    };
  }

  if (body?.model) {
    const values = body?.model?.map((e) => ObjectId(e));
    searchObj.model_id = {
      $nin: values,
    };
  }

  if (body?.origin) {
    const values = body?.origin?.map((e) => ObjectId(e));
    searchObj.origin_id = {
      $nin: values,
    };
  }

  if (body?.plate_type) {
    const values = body?.plate_type?.map((e) => ObjectId(e));
    searchObj.plate_type_id = {
      $nin: values,
    };
  }

  if (body?.sale_type) {
    const values = body?.sale_type?.map((e) => ObjectId(e));
    searchObj.sale_type_id = {
      $nin: values,
    };
  }

  if (body?.state) {
    const values = body?.state?.map((e) => ObjectId(e));
    searchObj.state_id = {
      $nin: values,
    };
  }

  if (body?.transmission) {
    const values = body?.transmission?.map((e) => ObjectId(e));
    searchObj.transmission_type_id = {
      $nin: values,
    };
  }

  if (body?.car_warranty_duration) {
    const values = body?.car_warranty_duration?.map((e) => ObjectId(e));
    searchObj.warranty_duration_id = {
      $nin: values,
    };
  }

  if (body?.state) {
    const values = body?.state?.map((e) => ObjectId(e));
    searchObj.state_id = {
      $nin: values,
    };
  }

  if (body?.seats) {
    const values = body?.seats?.map((e) => ObjectId(e));
    searchObj.seats_type_id = {
      $nin: values,
    };
  }

  if (body?.driving_readiness) {
    const values = body?.driving_readiness?.map((e) => ObjectId(e));
    searchObj.readiness_id = {
      $nin: values,
    };
  }

  if (body?.governorate) {
    const values = body?.governorate?.map((e) => ObjectId(e));
    searchObj.governorate_id = {
      $nin: values,
    };
  }

  if (body?.fuel) {
    const values = body?.fuel?.map((e) => ObjectId(e));
    searchObj.fuel_type_id = {
      $nin: values,
    };
  }

  if (body?.car_drivetrain_type) {
    const values = body?.car_drivetrain_type?.map((e) => ObjectId(e));
    searchObj.drivetrain_id = {
      $nin: values,
    };
  }

  if (body?.engine_size) {
    const values = body?.engine_size?.map((e) => ObjectId(e));
    searchObj.engine_size = {
      $nin: values,
    };
  }
  if (body?.car_location) {
    const values = body?.car_location?.map((e) => ObjectId(e));
    searchObj.governorate_id = {
      $nin: values,
    };
    searchObj.state_id = {
      $nin: values,
    };
  }
  return searchObj;
};

module.exports.structureQ = structureQ;
module.exports.exclude = exclude;
