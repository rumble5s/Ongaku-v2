const BaseServiceClass = require("./base.service");

class RoomServiceClass extends BaseServiceClass {}

const RoomService = new RoomServiceClass("Room");
module.exports = RoomService;
