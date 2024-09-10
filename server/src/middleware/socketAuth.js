const jwt = require("jsonwebtoken");
require("dotenv").config();

const socketAuth = (socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error("Authentication error"));
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return next(new Error("Authentication error"));
    }

    socket.user = decoded;
    next();
  });
};

module.exports = socketAuth;
