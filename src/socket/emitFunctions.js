const { dashboardStats } = require("../../utils/dashboardStatsCounter.js");

const getStats = async (io) => {
  let status_Array = [];
  const draft = {
    _id: "627925bfda535aadb15ef3d2",
    name: "Draft",
    count: await dashboardStats("627925bfda535aadb15ef3d2"),
  };
  const published = {
    _id: "627925bfda535aadb15ef3d3",
    name: "Published",
    count: await dashboardStats("627925bfda535aadb15ef3d3"),
  };

  const approved = {
    _id: "627925bfda535aadb15ef3d4",
    name: "Approved",
    count: await dashboardStats("627925bfda535aadb15ef3d4"),
  };

  const pendingReview = {
    _id: "627925bfda535aadb15ef3d5",
    name: "Pending Review",
    count: await dashboardStats("627925bfda535aadb15ef3d5"),
  };

  const soldviaDigitalMall = {
    _id: "627925bfda535aadb15ef3d6",
    name: "Sold via Digital Mall",
    count: await dashboardStats("627925bfda535aadb15ef3d6"),
  };
  const anotherSource = {
    _id: "627925bfda535aadb15ef3d7",
    name: "Sold via another source",
    count: await dashboardStats("627925bfda535aadb15ef3d7"),
  };
  const notSold = {
    _id: "627925bfda535aadb15ef3d8",
    name: "Not Sold",
    count: await dashboardStats("627925bfda535aadb15ef3d8"),
  };

  const duplicate = {
    _id: "627925bfda535aadb15ef3d9",
    name: "Duplicate",
    count: await dashboardStats("627925bfda535aadb15ef3d9"),
  };

  const wrongPrice = {
    _id: "627925bfda535aadb15ef3da",
    name: "Wrong Price",
    count: await dashboardStats("627925bfda535aadb15ef3da"),
  };

  const Rejected = {
    _id: "62d5bfd60890876f78fb03c5",
    name: "Rejected",
    count: await dashboardStats("62d5bfd60890876f78fb03c5"),
  };

  const Expired = {
    _id: "62dfca0216f52963325fce16",
    name: "Expired",
    count: await dashboardStats("62dfca0216f52963325fce16"),
  };

  status_Array = [
    draft,
    published,
    approved,
    pendingReview,
    soldviaDigitalMall,
    anotherSource,
    notSold,
    duplicate,
    wrongPrice,
    Rejected,
    Expired,
  ];

  return io.emit("receive_stats", status_Array);
};

module.exports.getStats = getStats;
