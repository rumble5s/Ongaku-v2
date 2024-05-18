const server = require("./initServer");
require("./connectDB");
require("./socketIo");
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

server.register(require("./routes/user.route"), { prefix: "/user" });
server.register(require("./routes/room.route"), { prefix: "/room" });
server.register(require("./routes/music.route"), { prefix: "/music" });
server.register(require("./routes/playlist.route"), { prefix: "/playlist" });

server.listen({ port: 3000 }, function (err, address) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  console.log(`Server is running on ${address}`);
});
