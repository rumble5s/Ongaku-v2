const Room = require("../controllers/room.controller");
const CatchAsyncError = require("../middleware/catchAsyncError");

module.exports = function (fastify, opts, done) {
  fastify.post("/search", CatchAsyncError(Room.Search));
  fastify.post("/create", CatchAsyncError(Room.CreateRoom));
  done();
};
