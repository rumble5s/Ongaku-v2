const BaseServiceClass = require("./base.service");

class UserServiceClass extends BaseServiceClass {}

const UserService = new UserServiceClass("User");
module.exports = UserService;
