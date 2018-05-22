const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const http = require('http');

const blogRoutes = require('./api/routes/blogs');
const postRoutes = require('./api/routes/posts');
const userRoutes = require('./api/routes/users');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); //uri that may access resources from my api
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if(req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE');
        return res.status(200).json({});
    }
    next();
});

app.use('/blogs', blogRoutes);
app.use('/blogs/:blogId/posts', postRoutes);
app.use('/users', userRoutes);

mongoose.connect('mongodb://localhost/blog-rest-api');
mongoose.Promise = global.Promise;

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404; 
    next(error);
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        error: {
            message: err.message
        }
    });
});

const port = process.env.PORT || 3000;

const server = http.createServer(app); 

server.listen(port);