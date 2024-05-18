const BaseServiceClass = require("./base.service");

class MusicServiceClass extends BaseServiceClass {}

const MusicService = new MusicServiceClass("Music");
module.exports = MusicService;
