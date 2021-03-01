const mongoose = require("mongoose");

const AlbumCategorySchema = new mongoose.Schema({
    albumTitleName: {
        type: String
    },
    album: [{
        type: mongoose.Schema.ObjectId,
        ref: "Album"
    }]

})

const AlbumCategory = mongoose.model("AlbumCategory", AlbumCategorySchema);
module.exports = AlbumCategory