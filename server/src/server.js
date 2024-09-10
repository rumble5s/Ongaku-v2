const statuscode = require("./constants/statuscode.constant");
require("dotenv").config();

//Init server
const server = require("fastify")();

//Setting corsheader
const cors = require("@fastify/cors");

server.register(cors, {
  origin: process.env.FRONTEND,
  methods: ["GET", "PUT", "POST", "DELETE"],
});

//Connect database
const mongo = require("@fastify/mongodb");

let database = null;

async function connectToDatabase() {
  if (!database) {
    try {
      await server.register(mongo, {
        forceClose: true,
        url: process.env.DATABASE,
      });
      database = server.mongo;
    } catch (err) {
      console.error("Error connect database", err);
      throw err;
    }
  }
  return database;
}

connectToDatabase();
module.exports = connectToDatabase;

//Setting multipart
const filesetting = require("./constants/filesetting.constant");

server.register(require("@fastify/multipart"), {
  limits: {
    fieldNameSize: 100,
    fieldSize: 100,
    fields: 10,
    fileSize: filesetting.filesize,
    files: 1,
    headerPairs: 2000,
    parts: 1000,
  },
});

//Routes
server.get("/", (request, reply) => {
  reply.status(statuscode.success).send("Welcome to ongaku-v2");
});

server.register(require("./routes/user.route"), { prefix: "/user" });
server.register(require("./routes/room.route"), { prefix: "/room" });
server.register(require("./routes/music.route"), { prefix: "/music" });
server.register(require("./routes/playlist.route"), { prefix: "/playlist" });

//Middleware verify token
const verifyToken = require("./middleware/auth");

server.addHook("onRequest", (request, reply, done) => {
  const exceptRoutes = ["/user/sign_in", "/user/sign_up"];
  const isMusicRoute = request.url.startsWith("/music/play");

  if (isMusicRoute || exceptRoutes.includes(request.url)) {
    done();
  } else {
    verifyToken(request, reply, done);
  }
});

//SocketIo
const fastifyIO = require("fastify-socket.io");
const socketIo = require("./socketIo/socketIo");
const socketAuth = require("./middleware/socketAuth");

server.register(fastifyIO, {
  cors: {
    origin: process.env.FRONTEND,
    methods: ["GET", "PUT", "POST", "DELETE"],
  },
});

server.ready().then(() => {
  server.io.use(socketAuth);
  socketIo(server.io);
});

//Server run on port 3000
server.listen({ port: 3000 }, function (err, address) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  console.log(`Server is running on ${address}`);
});
