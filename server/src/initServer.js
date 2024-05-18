const fastify = require("fastify");
const cors = require("@fastify/cors");
const statuscode = require("./constants/statuscode.constant");
const filesetting = require("./constants/filesetting.constant");
const server = fastify();

server.register(require("@fastify/multipart"), {
  limits: {
    fieldNameSize: 100, // Max field name size in bytes
    fieldSize: 100, // Max field value size in bytes
    fields: 10, // Max number of non-file fields
    fileSize: filesetting.filesize, // For multipart forms, the max file size in bytes
    files: 1, // Max number of file fields
    headerPairs: 2000, // Max number of header key=>value pairs
    parts: 1000, // For multipart forms, the max number of parts (fields + files)
  },
});

server.register(cors, {
  origin: "http://localhost:5173",
  methods: ["GET", "PUT", "POST", "DELETE"],
});

server.get("/", (request, reply) => {
  reply.status(statuscode.success).send("Welcome to ongaku-v2");
});

module.exports = server;
