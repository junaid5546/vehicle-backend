const express = require("express");
const connect = require("./src/db/connect.js");
const scheduleing = require("./src/schedules/schedule");
const cors = require("cors");
var path = require("path");
const http = require("http");
const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, { cors: { origin: "*" } });
const dotenv = require("dotenv");

// IMPORT ROUTRS
const authRoute = require("./src/routes/users/authentication/auth");
const healthchecker = require("./src/routes/healthchecker/healthchecker.js");
const userRoute = require("./src/routes/users/authentication/user.js");
const filtersRoute = require("./src/routes/Vehicles_for_sale/oman/vehicles/vehicleFilters");
const ReportReasonRoute = require("./src/routes/reports/oman/reportReason.js");
const postImagesRoutes = require("./src/routes/Vehicles_for_sale/oman/posts/postImagesRoutes.js");
const userImagesRoutes = require("./src/routes/users/authentication/userImagesRoutes.js");
const featuresRoutes = require("./src/routes/Vehicles_for_sale/oman/vehicles/features.js");
const posts_statuses = require("./src/routes/departments/posts/postsStatusRoutes.js");
const employees = require("./src/routes/employees/om/auth.js");
const vehiclesNumberRoutes = require("./src/routes/vehicles_numbers/oman/vehiclesNumberRoutes");
const post_types = require("./src/routes/users/post_types/oman/post_types");
const users_subscriptions_records_om = require("./src/routes/users/subscriptions/oman/users_subscriptions_records_om");
const qotation = require("./src/routes/users/qotations/oman/qotation");
const offers = require("./src/routes/offers/oman/offer.js");
const offers_avial = require("./src/routes/offers/oman/availOffers");
const departments = require("./src/routes/departments/departments");
const statsRouter = require("./src/routes/Vehicles_for_sale/oman/posts/postCountStats.js");
const posts_router = require("./src/routes/Vehicles_for_sale/oman/posts/vehicleForSalePost");
const makes = require("./src/routes/Vehicles_for_sale/oman/vehicles/categories/makes");
const terms_and_conditions = require("./src/routes/terms_conditions/terms_conditions.js");
const azure_stroage = require("./src/routes/azure_storage/azure_storage.js");
const app_updates = require("./src/routes/updates_app/oman/forced_update.js");
const maintenance_mode = require("./src/routes/updates_app/oman/maintenance_mode.js");
const controlls = require("./src/routes/appControls/index");
const healthCheck = require("./src/routes/healthCheck/healthCheck");
const migration = require("./src/routes/dataMigration.js");

const locations = require("./src/routes/locations/oman/locations");
const statstics = require("./src/routes/stats/stats");

const { socketHandler } = require("./src/socket/socket.js");
const { limiter } = require("./utils/rateLimiter.js");

const logger = require("./utils/logger.js");
const httpLogger = require("./utils/httpLogger.js");
//STATIC PATH FOR IMAGES & MIDDLEWARES
app.use(express.static(path.join(__dirname, "assets")));
app.use(express.static("/assets"));
app.use("/assets", express.static("assets"));
app.use(express.json({ limit: "5000000mb" }));

dotenv.config();
// GET THE PORT
const PORT = process.env.PORT || 8080;

// DATABASE CONNECTION
connect();

// CALL SCHEDULE FUNCTION
scheduleing();

// MIDDLEWARES
app.use(express.json());
app.use(cors());

// app.use(httpLogger);

app.get("/logger", (req, res) => {
  logger.info("working");
});

// ROUTE MIDDLEWARES
// app.use("/limit" / limiter);
app.get("/limit", (req, res) => {
  res.send("working");
});
app.use("/api/", [
  authRoute,
  userRoute,
  filtersRoute,
  posts_router(io),
  ReportReasonRoute,
  postImagesRoutes,
  userImagesRoutes,
  statsRouter(io),
  featuresRoutes,
  vehiclesNumberRoutes,
  post_types,
  users_subscriptions_records_om,
  departments,
  posts_statuses,
  employees,
  qotation,
  offers,
  offers_avial,
  makes,
  terms_and_conditions,
  azure_stroage,
  app_updates,
  locations,
  statstics,
  maintenance_mode,
  controlls,
  healthCheck,
  migration,
]);
server.listen(PORT, () => console.log(`Server up and running at ${PORT}`));
socketHandler(io);

module.exports = server