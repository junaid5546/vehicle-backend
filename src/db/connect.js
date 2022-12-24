const mongoose = require("mongoose");
const dotenv = require("dotenv");
const consola = require("consola");
var tunnel = require("tunnel-ssh");
dotenv.config();

async function connect() {
  return await mongoose
    .connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      consola.success("Database connected");
    })
    .catch((err) => {
      consola.error(new Error(err));
      process.exit(1);
    });
}

module.exports = connect;
