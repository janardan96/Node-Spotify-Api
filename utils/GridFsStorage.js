const dotenv = require("dotenv");
dotenv.config({ path: "../config.env" });
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
// const { Readable } = require('stream');
// const mongodb = require('mongodb');
// const Grid = require('gridfs-stream');
// const mongoose = require('mongoose');

// var conn = mongoose.connection;

// let gfs;
// conn.once('open', () => {
//     gfs = Grid(conn.db, mongoose.mongo);
//     // gfs.collection('uploads');
// });


const mongoUri = process.env.MONGODB_URI || "mongodb://localhost/Spotify-API"

// Create Store engine
const storage = new GridFsStorage({
    url: mongoUri,
    file: (req, file) => {
        // console.log(file);
        if (file.mimetype.split('/')[0] === 'audio') {
            // console.log(file.mimetype)
            return new Promise((resolve, reject) => {
                crypto.randomBytes(16, (err, buf) => {
                    if (err) {
                        return reject(err);
                    }
                    const filename = buf.toString('hex') + path.extname(file.originalname);
                    const fileInfo = {
                        filename: filename,
                        bucketName: 'uploads'
                    };
                    resolve(fileInfo);
                });
            });
        }
        // else {
        //     return null
        // };
    }
});


const multerFilter = (req, file, cb) => {
    // console.log(file) || file.mimetype.startsWith('video') || file.mimetype.startsWith('image')
    if (file.mimetype.startsWith('audio')) {
        cb(null, true);
    }
    else {
        cb(new Error("File is not Audio"), false);
    }
}

exports.upload = multer({ storage, fileFilter: multerFilter });

// const filter = (req, file, cb) => {
//     // console.log(file)
//     if (file.mimetype.startsWith('audio') || file.mimetype.startsWith('video') || file.mimetype.startsWith('image')) {
//         cb(null, true);
//     }
//     else {
//         cb(new Error("File is not Audio or Image"), false);
//     }
// }

// const fileNameStore = (file) => {
//     return new Promise((resolve, reject) => {
//         crypto.randomBytes(16, (err, buf) => {
//             if (err) {
//                 return reject(err);
//             }
//             const filename = buf.toString('hex') + path.extname(file.originalname);
//             // const fileInfo = {
//             //     filename: filename,
//             //     bucketName: 'uploads'
//             // };
//             resolve(filename);
//         });
//     });
// }

// const upload2 = multer({ storage: multer.memoryStorage(), fileFilter: filter })

// exports.uploadFiles = (req, res) => {
//     upload2.single('file')(req, res, err => {
//         if (err) {
//             return res.status(400).json({ message: "Upload Request Validation Failed" });
//         }

//         let title = req.body.title;
//         console.log(req.file)



//         fileNameStore(req.file).then((result) => {
//             // Covert buffer to Readable Stream
//             const readableAudioStream = new Readable();
//             readableAudioStream.push(req.file.buffer);
//             readableAudioStream.push(null);

//             let bucket = new mongodb.GridFSBucket(conn.db, {
//                 bucketName: 'uploads'
//             });
//             let uploadStream = bucket.openUploadStream(result);
//             let id = uploadStream.filename;
//             readableAudioStream.pipe(uploadStream);

//             uploadStream.on('error', () => {
//                 return res.status(500).json({ message: "Error uploading file" });
//             });

//             uploadStream.on('finish', () => {
//                 return res.status(201).json({ message: "File uploaded successfully, stored under Mongo ObjectID: " + id });
//             });
//         })
//     })
// }

