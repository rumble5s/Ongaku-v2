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

    const { sendEmailActiveAccount } = require("../utils/sendEmail.util");
    sendEmailActiveAccount(newUser);

    reply
      .status(statuscode.success)
      .send("Please check your email and activate your account!");
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

    if (user.isActivate == false) {
      const { sendEmailActiveAccount } = require("../utils/sendEmail.util");
      sendEmailActiveAccount(user);

      reply
        .status(statuscode.error)
        .send("Please check your email and activate your account!");
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

  static async VerifyEmail(request, reply) {
    const user = await UserModel.findById(request.params.userId);

    if (!user) {
      reply.status(statuscode.error).send("Wrong link!");
      return;
    }

    if (user.isActivate) {
      reply.status(statuscode.error).send("Account is already activated!");
      return;
    }

    user.isActivate = true;
    await UserModel.updateOne({ _id: user._id }, user);
    reply.status(statuscode.success).send("Successful!");
  }

  static RandomPassword() {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
    const length = Math.floor(Math.random() * 5) + 6;
    let password = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      password += characters[randomIndex];
    }

    return password;
  }

  static async ForgetPassword(request, reply) {
    const user = await UserModel.findOne({
      email: request.body.email,
    });

    if (!user) {
      reply.status(statuscode.error).send("This email is not signed up!");
      return;
    }

    if (user.isActivate == false) {
      const { sendEmailActiveAccount } = require("../utils/sendEmail.util");
      sendEmailActiveAccount(user);

      reply
        .status(statuscode.error)
        .send("Please check your email and activate your account!");
      return;
    }

    user.password = UserController.RandomPassword();
    await UserModel.updateOne({ _id: user._id }, user);

    const { sendEmailForgetPassword } = require("../utils/sendEmail.util");
    sendEmailForgetPassword(user);

    reply
      .status(statuscode.success)
      .send("Check your email to receive your new password!");
  }

  static async ChangePassword(request, reply) {
    const user = await UserModel.findById(request.body.userId);

    user.password = request.body.password;
    await UserModel.updateOne({ _id: user._id }, user);
    reply.status(statuscode.success).send("Successful!");
  }
}

module.exports = UserController;
