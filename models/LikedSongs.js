const mongoose = require("mongoose");
const LikedSongs = new mongoose.Schema({

    songt:{
        type: mongoose.Types.ObjectId,
        ref: "Song",
    },
    
})

const LikedSong = mongoose.model("LikedSongs", LikedSongs);

module.exports = LikedSong;