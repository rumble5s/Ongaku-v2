const Room = require("../controllers/room.controller");

module.exports = function (io) {
  io.on("connection", (socket) => {
    console.log(`new socket : ${socket.id}`);

    socket.on("join room", async function (roomId, userId) {
      Room.Join(roomId, userId, socket);
    });

    socket.on("leave room", function (roomId, userId) {
      Room.Leave(roomId, userId, socket);
    });

    socket.on("change music", function (roomId, musicId) {
      Room.ChangeMusic(roomId, musicId, socket);
    });

    socket.on("pause music", function (roomId) {
      Room.PauseMusic(roomId, socket);
    });

    socket.on("play music", function (roomId) {
      Room.PlayMusic(roomId, socket);
    });

    socket.on("seeked music", function (roomId, time) {
      Room.SeekedMusic(roomId, time, socket);
    });

    socket.on("add music", function (roomId, musicId) {
      Room.AddMusic(roomId, musicId, socket);
    });

    socket.on("delete music", function (roomId, musicId) {
      Room.DeleteMusic(roomId, musicId, socket);
    });

    socket.on("comment", function (roomId, message) {
      Room.Comment(roomId, message, socket);
    });

    socket.on("disconnect", function () {
      console.log(`${socket.id} disconnect`);
    });
  });
};
