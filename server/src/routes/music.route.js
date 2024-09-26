const MusicController = require("../controllers/music.controller");
const CatchAsyncError = require("../middlewares/catchAsyncError");

module.exports = function (fastify, opts, done) {
  fastify.get("/play/:musicId", CatchAsyncError(MusicController.Play));
  fastify.post("/search", CatchAsyncError(MusicController.Search));
  fastify.post("/upload", CatchAsyncError(MusicController.Upload));
  done();
};
