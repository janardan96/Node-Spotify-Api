const mongoose = require("mongoose");

const SongSchema = new mongoose.Schema({
    imageUri: {
        type: String,
        default: 'https://a10.gaanacdn.com/images/albums/20/233320/crop_175x175_233320.jpg'
    },
    imageId: { type: String },
    audioUri: String,
    title: String,
    artist: String
})

const Song = mongoose.model("Song", SongSchema);
module.exports = Song