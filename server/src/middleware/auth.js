const jwt = require("jsonwebtoken");
require("dotenv").config();
const statuscode = require("../constants/statuscode.constant");

function verifyToken(request, reply, done) {
  let token = request.headers["x-access-token"];

  if (!token) {
    return reply.status(statuscode.error).send("No token provided!");
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return reply.status(statuscode.error).send("Unauthorized!");
    }
    request.userId = decoded.id;
    done();
  });
}

module.exports = verifyToken;
