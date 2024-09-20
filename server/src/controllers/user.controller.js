const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");
require("dotenv").config();
const statuscode = require("../constants/statuscode.constant");

class UserController {
  static async SignUp(request, reply) {
    const check = await UserModel.exists({ email: request.body.email });

    if (check) {
      reply.status(statuscode.error).send("Failed! Email is already in use!");
      return;
    }

    const newUser = new UserModel({
      username: request.body.username,
      email: request.body.email,
      password: request.body.password,
      isActivate: false,
    });

    await newUser.save();

    reply.status(statuscode.success).send("Successful!");
  }

  static async SignIn(request, reply) {
    const user = await UserModel.findOne({
      email: request.body.email,
      password: request.body.password,
    });

    if (!user) {
      reply.status(statuscode.error).send("Wrong email or password!");
      return;
    }

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

module.exports = UserController;
