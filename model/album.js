const mongoose = require("mongoose");

const AlbumSchema = new mongoose.Schema({
    albumName: {
        type: String,
        default: 'Music Clone'
    },
    by: {
        type: String,
        default: 'Music Clone'

    },
    numberOfLikes: {
        type: Number,
        default: 0
    },
    imageUri: {
        type: String,
        default: 'https://cdn1.iconfinder.com/data/icons/weby-flat-multimedia-2/64/multimedia-02-512.png'
    },
    imageId: String,
    artistHeadLine: {
        type: String
    },
    song: [{
        type: mongoose.Schema.ObjectId,
        ref: "Song"
    }]

})

const Album = mongoose.model("Album", AlbumSchema);
module.exports = Album