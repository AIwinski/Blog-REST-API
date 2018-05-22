const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: {type: String, required: true},
	image: String,
	description: {type: String, required: true},
	category: {type: String, required: true},
	author: {type: String, required: true},
	posts = [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Post"
		}
	]
});

module.exports = mongoose.model('Blog', blogSchema); 