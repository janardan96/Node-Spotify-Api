const express = require("express");

const { getAllCategory } = require('../controller/albumCategory');
const AlbumRouter = express.Router();

AlbumRouter.get('/get_allCategory', getAllCategory);


module.exports = AlbumRouter