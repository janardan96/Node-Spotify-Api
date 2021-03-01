const express = require('express');
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const Grid = require('gridfs-stream');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const rateLimit = require("express-rate-limit");
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

// All Routes
const AlbumCategory = require("./routes/albumCategory");
const Album = require('./routes/album');
const Song = require("./routes/song");
const Admin = require('./routes/admin');


const app = express();

// Mongo Uri
const mongoUri = process.env.MONGODB_URI || "mongodb://localhost/Spotify-API"
// var conn = mongoose.createConnection(mongoUri);
mongoose
    .connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(() => console.log("MongoDB connected"))

// Middleware 
app.use(bodyParser.json());


//1.MiddleWare
// Set security http headers
app.use(helmet());
app.use(methodOverride('_method'))

// Limit request
const Limiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 100,
    message:
        "Too many request, please try again after an hour"
});
app.use('/api', Limiter);


// Body pareser
app.use(bodyParser.json({ limit: '10kb' }));
app.use(bodyParser.urlencoded({ extended: false }));

// Data Sanitization against NoSql query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss())

app.use(hpp());


// 2. CORS
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Mehtods", "GET,POST,PUT,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
    next();
});


// 3. All Routes
app.use("/api/albumCategory", AlbumCategory);
app.use('/api/album', Album);
app.use('/api/song', Song);
app.use('/api/admin', Admin);


const port = process.env.PORT || process.env.DEV_PORT;

const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

process.on('unhandledRejection', err => {
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    })
})