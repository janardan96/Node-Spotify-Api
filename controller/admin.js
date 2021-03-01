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

            if (!song) {
                return res.status(404).json({ error: 'Song not found' })
            };

            if (req.file) {
                if (song.imageId) await cloudinary.v2.uploader.destroy(song.imageId);

                const result = await cloudinary.v2.uploader.upload(req.file.path, {
                    width: 400,
                    height: 400,
                    radius: "max",
                    crop: "fill"
                });
                song.imageUri = result.secure_url;
                song.imageId = result.public_id;
            }

            const songUpdate = await song.save();
            return res.status(200).json({
                result: songUpdate,
            });
        }
        return res.status(404).json({ error: 'Invalid song  id' })

    } catch (error) {
        res.status(400).json({ badRequest: "Something is wrong" });
    }
}

exports.createAlbum = async (req, res) => {
    try {
        if (req.file) {
            const result = await cloudinary.v2.uploader.upload(req.file.path, {
                width: 400,
                height: 400,
                radius: "max",
                crop: "fill"
            });
            req.body.imageUri = result.secure_url;
            req.body.imageId = result.public_id;
        }
        const album = await Album.create(req.body);
        res.status(200).json({
            status: 'created',
            data: album
        })

    } catch (error) {
        res.status(400).json({ badRequest: "Something is wrong" });
    }
}

exports.storeSongIntoAlbum = async (req, res) => {
    try {
        const album = await Album.findOneAndUpdate(
            {
                albumName: req.body.albumName,
            },
            {
                $push: { song: req.body.songId },
            },
            {
                new: true,
                // upsert: true,
                useFindAndModify: false
            });
        await AlbumCategory.findOneAndUpdate(
            {
                albumTitleName: req.body.albumName,
            },
            {
                $push: { album: album._id },
            },
            {
                new: true,
                upsert: true,
                useFindAndModify: false
            }
        )
        res.status(200).json({
            status: 'created',
            data: album
        })

    } catch (error) {
        res.status(400).json({ badRequest: "Something is wrong" });
    }
}

exports.updateAlbum = async (req, res) => {
    try {
        const album = await Album.findOne({
            albumName: req.body.albumName
        });

        if (!album) {
            return res.status(404).json({ error: 'Album not found' })
        };

        if (req.body.newAlbumName !== album.albumName) {
            await AlbumCategory.findOneAndUpdate(
                {
                    albumTitleName: req.body.albumName,
                },
                {
                    albumTitleName: req.body.newAlbumName,
                },
            )
        }

        album.albumName = req.body.newAlbumName || album.albumName;
        album.by = req.body.by || album.by;
        album.artistHeadLine = req.body.artistHeadLine || album.artistHeadLine;

        if (req.file) {
            if (album.imageId) await cloudinary.v2.uploader.destroy(album.imageId);

            const result = await cloudinary.v2.uploader.upload(req.file.path, {
                width: 400,
                height: 400,
                radius: "max",
                crop: "fill"
            });
            album.imageUri = result.secure_url;
            album.imageId = result.public_id;
        }

        const albumUpdate = await album.save();
        return res.status(200).json({
            result: albumUpdate,
        });


    } catch (error) {
        res.status(400).json({ badRequest: "Something is wrong" });
    }

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





// if (req.files.songImage[1]) {
//     const result = await cloudinary.v2.uploader.upload(req.files.songImage[1].path, {
//         width: 400,
//         height: 400,
//         radius: "max",
//         crop: "fill"
//     });
// }

// Now push this song in Album Model
// const album = await Album.findOneAndUpdate(
//     {
//         name: req.body.albumName,
//     },
//     {
//         $set: {
//             by: req.body.by,
//             artistsHeadLine: req.body.artistsHeadLine,
//         },

//         $push: { song: songUpdate._id },
//     },
//     {
//         new: true,
//         upsert: true,
//         useFindAndModify: false
//     })