const PlaylistService = require("../services/playlist.service");
const statuscode = require("../constants/statuscode.constant");

class PlaylistController {
  async List(request, reply) {
    const list = await PlaylistService.Get(
      { user: request.body.userId },
      { name: 1 }
    );
    reply.status(statuscode.success).send(list);
  }

  async CreatePlaylist(request, reply) {
    const newPlaylist = {
      name: request.body.name,
      user: request.body.userId,
      list_music: [],
    };

    const playlist = await PlaylistService.Create(newPlaylist);
    newPlaylist._id = playlist.insertedId.toString();
    reply.status(statuscode.success).send(newPlaylist);
  }

  async Rename(request, reply) {
    const playlist = await PlaylistService.GetOne(request.body.playlistId);

    if (playlist) {
      playlist.name = request.body.name;
      PlaylistService.Update(playlist._id, playlist);
      reply.status(statuscode.success).send("Successful!");
    } else reply.status(statuscode.success).send("Not found playlist");
  }

  async DeletePlaylist(request, reply) {
    const playlist = await PlaylistService.GetOne(request.body.playlistId);

    if (playlist) {
      PlaylistService.Delete(playlist._id);
      reply.status(statuscode.success).send("Successful!");
    } else reply.status(statuscode.error).send("Not found playlist");
  }

  async ListMusic(request, reply) {
    const playlist = await PlaylistService.GetOne(request.body.playlistId);

    if (playlist) {
      reply.status(statuscode.success).send(playlist.list_music);
    } else reply.status(statuscode.error).send("Not found playlist");
  }

  async AddMusic(request, reply) {
    const playlist = await PlaylistService.GetOne(request.body.playlistId);

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
      const MusicService = require("../services/music.service");
      const music = await MusicService.GetOne(request.body.musicId);

      if (!music) {
        reply.status(statuscode.error).send("Not found music");
        return;
      }

      playlist.list_music.push(music);

      PlaylistService.Update(request.body.playlistId, playlist);

      reply.status(statuscode.success).send("Successful!");
    }
  }

  async DeleteMusic(request, reply) {
    const playlist = await PlaylistService.GetOne(request.body.playlistId);

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

      PlaylistService.Update(request.body.playlistId, playlist);

      reply.status(statuscode.success).send("Successful!");
    }
  }
}

const Playlist = new PlaylistController();

module.exports = Playlist;
