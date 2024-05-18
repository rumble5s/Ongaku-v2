const server = require("./initServer");
const mongo = require("@fastify/mongodb");

server.register(mongo, {
  forceClose: true,
  url: "mongodb://127.0.0.1:27017/ongaku-v2",
});
