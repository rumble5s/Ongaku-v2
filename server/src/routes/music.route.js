const Music = require("../controllers/music.controller");
const CatchAsyncError = require("../middleware/catchAsyncError");

module.exports = function (fastify, opts, done) {
  fastify.get("/play/:musicId", CatchAsyncError(Music.Play));
  fastify.post("/search", CatchAsyncError(Music.Search));
  fastify.post("/upload", CatchAsyncError(Music.Upload));
  done();
};
