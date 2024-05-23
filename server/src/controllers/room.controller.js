const RoomService = require("../services/room.service");
const statuscode = require("../constants/statuscode.constant");

class RoomController {
  async CreateRoom(request, reply) {
    const newroom = {
      name: request.body.roomname,
      list_music: [],
      current_music: {
        Id: null,
        pause: true,
        time: null,
        lastUpdate: null,
      },
      list_user: [],
    };
    const room = await RoomService.Create(newroom);
    newroom._id = room.insertedId.toString();
    reply.status(statuscode.success).send(newroom);
  }

  async Search(request, reply) {
    let rooms = await RoomService.Get({}, {});

    rooms = rooms.filter((item) => item.name.includes(request.body.search));

    reply.status(statuscode.success).send(rooms);
  }

  async Join(roomId, userId, socket) {
    const room = await RoomService.GetOne(roomId);

    if (!room) {
      socket.emit("error", "Not found room");
      return;
    }

    socket.join(`room${roomId}`);
    socket.to(`room${roomId}`).emit("join room", userId);

    if (!room.list_user.some((item) => item == userId))
      room.list_user.push(userId);
    const currentTime = Date.now();

    room.current_music = {
      Id: room.current_music.Id,
      pause: room.current_music.pause,
      time: room.current_music.pause
        ? room.current_music.time
        : room.current_music.time +
          (currentTime - room.current_music.lastUpdate) / 1000,
      lastUpdate: currentTime,
    };

    RoomService.Update(roomId, room);

    socket.emit("current", room);
  }

  async Leave(roomId, userId, socket) {
    const room = await RoomService.GetOne(roomId);

    if (!room) {
      socket.emit("error", "Not found room");
      return;
    }

    socket.to(`room${roomId}`).emit("leave room", userId);
    socket.leave(`room${roomId}`);

    room.list_user = room.list_user.filter((item) => item != userId);

    if (room.list_user.length) RoomService.Update(roomId, room);
    else {
      RoomService.Delete(roomId);
      socket.broadcast.emit("delete room", roomId);
      socket.emit("delete room", roomId);
    }

    socket.disconnect();
  }

  async ChangeMusic(roomId, musicId, socket) {
    const room = await RoomService.GetOne(roomId);

    if (!room) {
      socket.emit("error", "Not found room");
      return;
    }

    if (room.current_music.Id == musicId) {
      return;
    }

    socket.to(`room${roomId}`).emit("change music", musicId);
    socket.emit("change music", musicId);

    const currentTime = Date.now();

    room.current_music = {
      Id: musicId,
      pause: false,
      time: 0,
      lastUpdate: currentTime,
    };

    RoomService.Update(roomId, room);
  }

  async PauseMusic(roomId, socket) {
    const room = await RoomService.GetOne(roomId);

    if (!room) {
      socket.emit("error", "Not found room");
      return;
    }

    if (room.current_music.pause == true) {
      return;
    }

    socket.to(`room${roomId}`).emit("pause music");

    const currentTime = Date.now();

    room.current_music = {
      Id: room.current_music.Id,
      pause: true,
      time:
        room.current_music.time +
        (currentTime - room.current_music.lastUpdate) / 1000,
      lastUpdate: currentTime,
    };

    RoomService.Update(roomId, room);
  }

  async PlayMusic(roomId, socket) {
    const room = await RoomService.GetOne(roomId);

    if (!room) {
      socket.emit("error", "Not found room");
      return;
    }

    if (room.current_music.pause == false) {
      return;
    }

    socket.to(`room${roomId}`).emit("play music");

    const currentTime = Date.now();

    room.current_music = {
      Id: room.current_music.Id,
      pause: false,
      time: room.current_music.time,
      lastUpdate: currentTime,
    };

    RoomService.Update(roomId, room);
  }

  async SeekedMusic(roomId, time, socket) {
    const room = await RoomService.GetOne(roomId);

    if (!room) {
      socket.emit("error", "Not found room");
      return;
    }

    if (room.current_music.time == time) {
      return;
    }

    socket.to(`room${roomId}`).emit("seeked music", time);

    const currentTime = Date.now();

    room.current_music = {
      Id: room.current_music.Id,
      pause: room.current_music.pause,
      time: time,
      lastUpdate: currentTime,
    };

    RoomService.Update(roomId, room);
  }

  async AddMusic(roomId, musicId, socket) {
    const room = await RoomService.GetOne(roomId);

    if (!room) {
      socket.emit("error", "Not found room");
      return;
    }

    if (room.list_music.some((item) => item._id == musicId)) {
      socket.emit("error", "This music is already exist");
      return;
    }

    const MusicService = require("../services/music.service");
    const music = await MusicService.GetOne(musicId);

    socket.to(`room${roomId}`).emit("add music", music);
    socket.emit("add music", music);
    room.list_music.push(music);
    RoomService.Update(roomId, room);
  }

  async DeleteMusic(roomId, musicId, socket) {
    const room = await RoomService.GetOne(roomId);

    if (!room) {
      socket.emit("error", "Not found room");
      return;
    }

    socket.to(`room${roomId}`).emit("delete music", musicId);
    socket.emit("delete music", musicId);
    room.list_music = room.list_music.filter((item) => item._id != musicId);
    RoomService.Update(roomId, room);
  }

  async Comment(roomId, message, socket) {
    const room = await RoomService.GetOne(roomId);

    if (!room) {
      socket.emit("error", "Not found room");
      return;
    }

    socket.to(`room${roomId}`).emit("comment", message);
    socket.emit("comment", message);
  }
}

const Room = new RoomController("Room");

module.exports = Room;
