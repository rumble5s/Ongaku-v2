const User = require("../controllers/user.controller");
const CatchAsyncError = require("../middleware/catchAsyncError");

module.exports = function (fastify, opts, done) {
  fastify.post("/sign_up", CatchAsyncError(User.SignUp));
  fastify.post("/sign_in", CatchAsyncError(User.SignIn));
  done();
};
