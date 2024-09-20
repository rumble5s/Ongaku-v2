const mongoose = require("mongoose");

const CurrentMusicSchema = new mongoose.Schema({
  Id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Music",
    default: null,
  },
  pause: {
    type: Boolean,
    default: true,
  },
  time: {
    type: Date,
    default: null,
  },
  lastUpdate: {
    type: Date,
    default: null,
  },
});

const RoomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  list_music: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Music",
    },
  ],
  current_music: {
    type: CurrentMusicSchema,
    default: {},
  },
  list_user: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const RoomModel = mongoose.model("Room", RoomSchema);

module.exports = RoomModel;
