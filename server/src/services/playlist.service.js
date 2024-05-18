const BaseServiceClass = require("./base.service");

class PlaylistServiceClass extends BaseServiceClass {}

const PlaylistService = new PlaylistServiceClass("Playlist");
module.exports = PlaylistService;
