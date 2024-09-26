const PlaylistController = require("../controllers/playlist.controller");
const CatchAsyncError = require("../middlewares/catchAsyncError");

module.exports = function (fastify, opts, done) {
  fastify.post("/list", CatchAsyncError(PlaylistController.List));
  fastify.post("/create", CatchAsyncError(PlaylistController.CreatePlaylist));
  fastify.post("/rename", CatchAsyncError(PlaylistController.Rename));
  fastify.post("/delete", CatchAsyncError(PlaylistController.DeletePlaylist));
  fastify.post("/list_music", CatchAsyncError(PlaylistController.ListMusic));
  fastify.post("/add_music", CatchAsyncError(PlaylistController.AddMusic));
  fastify.post(
    "/delete_music",
    CatchAsyncError(PlaylistController.DeleteMusic)
  );
  done();
};
