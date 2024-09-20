const mongoose = require("mongoose");

const PlaylistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  list_music: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Music",
    },
  ],
});

const PlaylistModel = mongoose.model("Playlist", PlaylistSchema);

module.exports = PlaylistModel;
