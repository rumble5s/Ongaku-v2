const Playlist = require("../controllers/playlist.controller");
const CatchAsyncError = require("../middleware/catchAsyncError");

module.exports = function (fastify, opts, done) {
  fastify.post("/list", CatchAsyncError(Playlist.List));
  fastify.post("/create", CatchAsyncError(Playlist.CreatePlaylist));
  fastify.post("/rename", CatchAsyncError(Playlist.Rename));
  fastify.post("/delete", CatchAsyncError(Playlist.DeletePlaylist));
  fastify.post("/list_music", CatchAsyncError(Playlist.ListMusic));
  fastify.post("/add_music", CatchAsyncError(Playlist.AddMusic));
  fastify.post("/delete_music", CatchAsyncError(Playlist.DeleteMusic));
  done();
};
