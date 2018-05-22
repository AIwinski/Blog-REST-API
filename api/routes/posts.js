const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');

const Post = require('../models/post');
const Blog = require('../models/blog');

router.get('/', (req, res, next) => {
    Blog.findOne({_id: req.params.blogId})
    .populate('posts')
    .exec()
    .then(doc => {
        if(doc) {
            res.status(200).json({
                posts: doc.posts,
                quantity: doc.posts.length
            });
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

router.post('/', checkAuth, (req, res, next) => {
    Blog.findOne({_id: req.params.blogId})
    .exec()
    .then(doc => {
        if(doc) {
            const post = new Post({
                _id: new mongoose.Types.ObjectId(),
                title: req.body.title,
                content: req.body.content,
            });
            post.save()
            .then(result => {
                doc.posts.push(result._id);
                res.status(201).json({
                    createdPost: result
                });
            }).catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
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

router.get('/:postId', (req, res, next) => {
    Post.findOne({_id: req.params.postId})
    .exec()
    .then(doc => {
        if(doc) {
            res.status(200).json(doc);
        } else {
            res.status(404).json({
                message: 'Not found any post with such id'
            });
        }
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
});



router.patch('/:postId', checkAuth, (req, res, next) => {
    const id = req.params.postId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Post.update({_id: id}, {$set: updateOps})
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

router.delete('/:postId', checkAuth, (req, res, next) => {
    const id = req.params.postId;
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