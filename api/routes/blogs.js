const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');
const multer = require('multer');

const Blog = require('../models/blog');

//============MULTER SETINGS==============================

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads');
    },
    fileName: function(req, file, cb) {
        cb(null, file.fileName)
    }
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true); //save 
    } else {
        cb(null, false); //dont save
    }
}

const upload = multer({
    storage: storage, limits: {
        fileSize: 1024 * 1024 * 5 //max 5 mb
    },
    fileFilter: fileFilter
});


router.get('/', (req, res, next) => {
    Blog.find({})
    .exec()
    .then(docs => {
        res.status(200).json(docs);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.post('/', checkAuth, upload.single('image'), (req, res, next) => {
    const blog = new Blog({
        _id: new mongoose.Types.ObjectId(),
        image: req.file.path,
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        author: req.body.author
    });
    blog.save()
    .then(result => {
        res.status(201).json({
            createdBlog: result
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.get('/:blogId', (req, res, next) => {
    Blog.findOne({_id: req.params.blogId})
    .exec()
    .then(doc => {
        if(doc) {
            res.status(200).json(doc);
        } else {
            res.status(404).json({
                message: 'Not found any blog with such id'
            });
        }
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
});

router.patch('/:blogId', checkAuth, (req, res, next) => {
    const id = req.params.blogId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Blog.update({_id: id}, {$set: updateOps})
    .exec()
    .then(result => {
        res.status(200).json(result);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.delete('/:blogId', checkAuth, (req, res, next) => {
    const id = req.params.blogId;
    Blog.remove({_id: id})
    .exec()
    .then(result => {
        res.status(200).json(result);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

module.exports = router;