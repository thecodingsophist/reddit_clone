// imports in JS
const Comment = require('../models/comment');
const Post = require('../models/post')
const User = require('../models/user')

const requiresLogin = require('../middleware/requires-login')


module.exports = function(app) {

    app.post('/posts/:postId/comments', (req, res) => {
		// INSTANTIATE INSTANCE OF COMMENT MODEL
		const comment = new Comment(req.body);
		comment.author = req.user._id;
        comment.postId = req.params.postId
		comment
			// Save instance to DB
			.save()
			// Find the parent Post
			.then(() => {
				return Post.findById(req.params.postId);

			})
			.then((post) => {
				post.comments.unshift(comment);
				post.save();
			})
			// Find the parent User
			.then(() => {
				return User.findById(req.user._id);
			})
			// Find the author, save its posts
			.then((user) => {
				user.comments.unshift(comment);
				user.save();
			})
			// Redirect to original Post
			.then(() => {
				res.redirect('/posts/' + req.params.postId);
			})
			.catch((err) => {
				console.log(err);
			});
	});
    };
