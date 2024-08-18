const MusicService = require("../services/music.service");
const fs = require("fs");
const util = require("node:util");
const { pipeline } = require("node:stream");
const pump = util.promisify(pipeline);
const statuscode = require("../constants/statuscode.constant");
const filesetting = require("../constants/filesetting.constant");

class MusicController {
  async Search(request, reply) {
    let musics = await MusicService.Get({}, {});

    musics = musics.filter((item) => item.name.includes(request.body.search));

    reply.status(statuscode.success).send(musics);
  }

  async Play(request, reply) {
    const musicId = request.params.musicId;
    const music = await MusicService.GetOne(musicId);

    if (!music) return reply.status(statuscode.error).send("File not found");

    const stat = fs.statSync(music.url);
    const fileSize = stat.size;
    const range = request.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = Math.min(fileSize, start + filesetting.chunksize) - 1;

      const chunksize = end - start + 1;
      const file = fs.createReadStream(music.url, { start, end });
      const head = {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize,
        "Content-Type": "video/mp4",
      };
      reply.status(statuscode.partial).headers(head);
      return reply.send(file);
    } else {
      const head = {
        "Content-Length": fileSize,
        "Content-Type": "video/mp4",
      };
      reply.status(statuscode.success).headers(head);
      const file = fs.createReadStream(music.url);
      return reply.status(statuscode.success).send(file);
    }
  }

  async Upload(request, reply) {
    const data = await request.file();
    const path = require("path");
    const musicPath = path.resolve(__dirname, "../music");

    if (data.fileSize > filesetting.filesize) {
      reply
        .status(statuscode.error)
        .send({ error: "Please upload smaller file" });
    }

    const newMusic = await MusicService.Create({
      name: data.fields.name.value,
      url: "",
    });

    MusicService.Update(newMusic.insertedId.toString(), {
      name: data.fields.name.value,
      url: `${musicPath}/${newMusic.insertedId.toString()}.mp3`,
    });

    await pump(
      data.file,
      fs.createWriteStream(`${musicPath}/${newMusic.insertedId.toString()}.mp3`)
    );

    reply
      .status(statuscode.success)
      .send({ _id: newMusic.insertedId.toString() });
  }
}

const Music = new MusicController("Music");

module.exports = Music;
