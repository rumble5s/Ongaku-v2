const mongoose = require("mongoose");

const MusicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
  },
  url: {
    type: String,
  },
});

const MusicModel = mongoose.model("Music", MusicSchema);

module.exports = MusicModel;
