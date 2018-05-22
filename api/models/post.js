const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: String,
	content: String,
    date: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Post', postSchema); 