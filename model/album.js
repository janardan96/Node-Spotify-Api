const mongoose = require("mongoose");

const AlbumSchema = new mongoose.Schema({
    name: {
        type: String
    },
    by: {
        type: String
    },
    numberOfLikes: {
        type: Number,
        default: 0
    },
    imageUri: {
        type: String
    },
    artistsHeadLine: {
        type: String
    },
    song: [{
        type: mongoose.Schema.ObjectId,
        ref: "Song"
    }]

})

const Album = mongoose.model("Album", AlbumSchema);
module.exports = Album