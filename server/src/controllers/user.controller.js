const server = require("../initServer");
const jwt = require("jsonwebtoken");
const UserService = require("../services/user.service");
const secret = require("../config/secretkey.config");
const statuscode = require("../constants/statuscode.constant");

class UserController {
  async SignUp(request, reply) {
    const user = await server.mongo.db
      .collection(UserService.name)
      .findOne({ username: request.body.username });

    if (user) {
      reply
        .status(statuscode.error)
        .send("Failed! Username is already in use!");
      return;
    }

    UserService.Create({
      username: request.body.username,
      password: request.body.password,
    });

    reply.status(statuscode.success).send("Successful!");
  }

  async SignIn(request, reply) {
    const user = await server.mongo.db.collection(UserService.name).findOne({
      username: request.body.username,
      password: request.body.password,
    });

    if (!user) {
      reply.status(statuscode.error).send("Wrong username or password!");
      return;
    }

    const token = jwt.sign({ id: user._id }, secret.secret, {
      algorithm: "HS256",
      allowInsecureKeySizes: true,
    });

    reply.status(statuscode.success).send({
      userId: user._id,
      username: user.username,
      token: token,
    });
  }
}

const User = new UserController("User");

module.exports = User;
