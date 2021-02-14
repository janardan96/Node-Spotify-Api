const express = require("express");

const { getAllCategory } = require('../controller/albumCategory');
const AlbumCategoryRouter = express.Router();

AlbumCategoryRouter.get('/get_allCategory', getAllCategory);


module.exports = AlbumCategoryRouter