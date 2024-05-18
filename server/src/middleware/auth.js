const jwt = require("jsonwebtoken");
const secret = require("../config/secretkey.config");
const statuscode = require("../constants/statuscode.constant");

function verifyToken(request, reply, done) {
  let token = request.headers["x-access-token"];

  if (!token) {
    return reply.status(statuscode.error).send("No token provided!");
  }

  jwt.verify(token, secret.secret, (err, decoded) => {
    if (err) {
      return reply.status(statuscode.error).send("Unauthorized!");
    }
    request.userId = decoded.id;
    done();
  });
}

module.exports = verifyToken;
