const jwt = require("jsonwebtoken");
const UserService = require("../services/user.service");
require("dotenv").config();
const statuscode = require("../constants/statuscode.constant");

class UserController {
  async SignUp(request, reply) {
    const check = await UserService.Get({ username: request.body.username }, {});

    if (check.length) {
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
    const check = await UserService.Get(
      {
        username: request.body.username,
        password: request.body.password,
      },
      {}
    );
    if (!check.length) {
      reply.status(statuscode.error).send("Wrong username or password!");
      return;
    }

    const user = check[0];

    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
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
