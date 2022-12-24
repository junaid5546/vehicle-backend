const { getStats } = require("./emitFunctions");

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    socket.on("stats_request", async () => {
      socket.emit("get_stats", {
        data: await getStats(io),
      });
    });
  });
};

module.exports.socketHandler = socketHandler;
