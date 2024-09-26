const UserController = require("../controllers/user.controller");
const CatchAsyncError = require("../middlewares/catchAsyncError");

module.exports = function (fastify, opts, done) {
  fastify.post("/sign_up", CatchAsyncError(UserController.SignUp));
  fastify.post("/sign_in", CatchAsyncError(UserController.SignIn));
  fastify.get(
    "/verify_email/:userId",
    CatchAsyncError(UserController.VerifyEmail)
  );
  fastify.post(
    "/forget_password",
    CatchAsyncError(UserController.ForgetPassword)
  );
  fastify.post(
    "/change_password",
    CatchAsyncError(UserController.ChangePassword)
  );
  done();
};
