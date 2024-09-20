const PlaylistModel = require("../models/playlist.model");
const statuscode = require("../constants/statuscode.constant");

class PlaylistController {
  static async List(request, reply) {
    const list = await PlaylistModel.find(
      { user: request.body.userId },
      { name: 1 }
    );
    reply.status(statuscode.success).send(list);
  }

  static async CreatePlaylist(request, reply) {
    const newPlaylist = new PlaylistModel({
      name: request.body.name,
      user: request.body.userId,
      list_music: [],
    });

    await newPlaylist.save();
    reply.status(statuscode.success).send(newPlaylist);
  }

  static async Rename(request, reply) {
    const playlist = await PlaylistModel.findById(request.body.playlistId);

    if (playlist) {
      playlist.name = request.body.name;
      await PlaylistModel.updateOne({ _id: playlist._id }, playlist);
      reply.status(statuscode.success).send("Successful!");
    } else reply.status(statuscode.success).send("Not found playlist");
  }

  static async DeletePlaylist(request, reply) {
    const playlist = await PlaylistModel.findById(request.body.playlistId);

    if (playlist) {
      await PlaylistModel.findByIdAndDelete(playlist._id);
      reply.status(statuscode.success).send("Successful!");
    } else reply.status(statuscode.error).send("Not found playlist");
  }

  static async ListMusic(request, reply) {
    const playlist = await PlaylistModel.findById(
      request.body.playlistId
    ).populate("list_music");

    if (playlist) {
      reply.status(statuscode.success).send(playlist.list_music);
    } else reply.status(statuscode.error).send("Not found playlist");
  }

  static async AddMusic(request, reply) {
    const playlist = await PlaylistModel.findById(request.body.playlistId);

    if (!playlist) {
      reply.status(statuscode.error).send("Not found playlist");
      return;
    }

    const check = playlist.list_music.some(
      (item) => item._id == request.body.musicId
    );

    if (check)
      reply.status(statuscode.error).send("This music already in playlist!");
    else {
      const MusicModel = require("../models/music.model");
      const music = await MusicModel.findById(request.body.musicId);

      if (!music) {
        reply.status(statuscode.error).send("Not found music");
        return;
      }

      playlist.list_music.push(music._id);
      await PlaylistModel.updateOne({ _id: request.body.playlistId }, playlist);
      reply.status(statuscode.success).send("Successful!");
    }
  }

  static async DeleteMusic(request, reply) {
    const playlist = await PlaylistModel.findById(request.body.playlistId);

    if (!playlist) {
      reply.status(statuscode.error).send("Not found playlist");
      return;
    }

    const check = playlist.list_music.some(
      (item) => item._id == request.body.musicId
    );

    if (!check)
      reply.status(statuscode.error).send("Not found this music in playlist!");
    else {
      playlist.list_music = playlist.list_music.filter(
        (item) => item._id != request.body.musicId
      );

      await PlaylistModel.updateOne({ _id: request.body.playlistId }, playlist);
      reply.status(statuscode.success).send("Successful!");
    }
  }
}

module.exports = PlaylistController;
