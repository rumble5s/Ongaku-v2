const UserController = require("../controllers/user.controller");
const CatchAsyncError = require("../middleware/catchAsyncError");

module.exports = function (fastify, opts, done) {
  fastify.post("/sign_up", CatchAsyncError(UserController.SignUp));
  fastify.post("/sign_in", CatchAsyncError(UserController.SignIn));
  done();
};
