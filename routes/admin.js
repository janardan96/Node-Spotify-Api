const express = require("express");
// const multer = require('multer');
const { upload } = require('../utils/GridFsStorage');
const { imageMulter, resizeImages } = require('../utils/cloudinary')
const { uploadAudio, getAudio, uploadSongImage } = require('../controller/admin');

const Admin = express.Router();

Admin.post('/upload',
    upload.single('file'),
    uploadAudio
    // uploadFiles
);

Admin.put('/songImage',
    // imageMulter.single('songImage'),

    imageMulter.fields([
        { name: 'songImage' },
        { name: 'albumImage' }
    ]),
    // resizeImages,
    uploadSongImage);

Admin.get('/song/:filename', getAudio)


module.exports = Admin