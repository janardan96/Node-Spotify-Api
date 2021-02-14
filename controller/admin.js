const AlbumCategory = require('../model/albumCategoryModel');
const Album = require('../model/album');
const Song = require('../model/song');
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const cloudinary = require("cloudinary");

var conn = mongoose.connection;

let gfs;
conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
});

// const  uploadAudioFn= async (req)=>{
//     const newSong = await Song.create({
//         audioUri: req.file.filename,
//         title: req.body.title,
//         artist: req.body.artist
//     })
// }

exports.uploadAudio = async (req, res) => {
    // console.log(req.files);
    const newSong = await Song.create({
        audioUri: req.file.filename,
        title: req.body.title,
        artist: req.body.artist
    })
    res.status(201).json({ data: newSong })
}

exports.uploadSongImage = async (req, res) => {
    // const result = await cloudinary.v2.uploader.upload(req.file.path);
    try {
        if (req.body.id.match(/^[0-9a-fA-F]{24}$/)) {
            const song = await Song.findById(req.body.id);
            // console.log(req.files);

            if (!song) {
                return res.status(404).json({ error: 'Song not found2' })
            };

            const result = await cloudinary.v2.uploader.upload(req.files.songImage[0].path, { width: 400, crop: "pad" });
            song.imageUri = result.secure_url;
            song.imageId = result.public_id;
            const songUpdate = await song.save();
            return res.status(200).json({ result: songUpdate });
            // return res.status(200).json({ ok: 'Ok' })

        }
        return res.status(404).json({ error: 'Invalid song  id' })

    } catch (error) {
        res.status(400).json({ badRequest: "Something is wrong" });
    }

    // const result = await cloudinary.v2.uploader.upload(req.file.path);

}


// Get single files
exports.getAudio = async (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
        if (!file || file.length === 0) {
            return res.status(404).json({
                err: 'No file exists'
            });
        }
        // Files exits
        if (req.headers['range']) {
            var parts = req.headers['range'].replace(/bytes=/, "").split("-");
            var partialstart = parts[0];
            var partialend = parts[1];

            var start = parseInt(partialstart, 10);
            var end = partialend ? parseInt(partialend, 10) : file.length - 1;
            var chunksize = (end - start) + 1;

            res.writeHead(206, {
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Range': 'bytes ' + start + '-' + end + '/' + file.length,
                'Content-Type': file.contentType
            });

            gfs.createReadStream({
                filename: file.filename,
                range: {
                    startPos: start,
                    endPos: end
                }
            }).pipe(res);
        } else {
            res.header('Content-Length', file.length);
            res.header('Content-Type', file.contentType);

            gfs.createReadStream({
                filename: file.filename,
            }).pipe(res);
        }

    })
}

