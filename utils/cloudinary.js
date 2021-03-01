const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const sharp = require('sharp');

exports.cloudinary = cloudinary.config({
    cloud_name: process.env.cloudinary_cloud_name,
    api_key: process.env.cloudinary_api_key,
    api_secret: process.env.cloudinary_api_secret
});

// exports.resizeImages = async (req, res, next) => {
//     console.log(req.file)
//     if (!req.file.songImage || !req.file.albumImage) return next();
//     await sharp(req.file.path)
//         .resize(500, 500)
//         .toFormat('png')
//         .jpeg({ quality: 90 });
//     next();
// };


exports.imageMulter = multer({
    storage: multer.diskStorage({}),
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image')
            // !file.mimetype.match(/jpe|jpeg|png|gif$i/)
        ) {
            cb(null, true);
        }
        else {
            cb(new Error("File is not image"), false);
            return;
        }
    }
});
