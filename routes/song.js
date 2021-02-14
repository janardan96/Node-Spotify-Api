const express = require("express");

const { getAllCategory } = require('../controller/albumCategory');
const SongRouter = express.Router();

SongRouter.get('/get_allCategory', getAllCategory);


module.exports = SongRouter