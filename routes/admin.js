const express = require("express");
// const multer = require('multer');
const { upload } = require('../utils/GridFsStorage');
const { imageMulter } = require('../utils/cloudinary')
const { uploadAudio, getAudio, uploadSongImage, createAlbum, storeSongIntoAlbum, updateAlbum } = require('../controller/admin');

const Admin = express.Router();

Admin.post('/uploadSongFile',
    upload.single('file'),
    uploadAudio
    // uploadFiles
);

Admin.put('/songImage',
    imageMulter.single('songImage'),
    uploadSongImage
);

Admin.post('/createAlbum',
    imageMulter.single('albumImage'),
    createAlbum
)

Admin.put('/updateAlbumSongList',
    storeSongIntoAlbum
)

Admin.put('/updateAlbum',
    imageMulter.single('albumImage'),
    updateAlbum
)

Admin.get('/song/:filename', getAudio)


module.exports = Admin