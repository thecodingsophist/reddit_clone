const Comment = require('../models/comment');
const Post = require('../models/post')
const User = require('../models/user')

const requiresLogin = require('../middleware/requires-login')


module.exports = function(app) {

    // // CREATE Comment
    // app.post("/posts/:postId/comments", function(req, res) {
    //   // INSTANTIATE INSTANCE OF MODEL
    //   const comment = new Comment(req.body);
    //   comment.author = req.user._id;
    //   // SAVE INSTANCE OF Comment MODEL TO DB
    //   comment
    //     .save()
    //     .then(comment => {
    //     //    return Post.findById(req.params.postId);
    //         return User.findById(req.user._id);
    //     })
    //     .then(post => {
    //         post.comments.unshift(comment);
    //         return post.save();
    //     })
    //     .then(comment => {
    //       // REDIRECT TO THE ROOT
    //       return res.redirect(`/`);
    //     })
    //     .catch(err => {
    //       console.log(err);
    //     });
    // });

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

    //THIS VERSION HAS ONE COMMENT
    // app.post("/posts/:postId/comments", requiresLogin, function(req, res) {
    //     console.log("in comment route");
    //     // INSTANTIATE INSTANCE OF COMMENT MODEL, ADD AUTHOR.
    //     const comment = new Comment(req.body);
    //     comment.author = req.user._id;
    //     // SAVE INSTANCE OF Comment MODEL TO DB
    //     comment.save()
    //     // FIND THIS POST WITH REQ.PARAMS.POSTID
    //     Post.findById(req.params.postId)
    //     .then((post) => {
    //         // append the comment._id to the front of the array
    //         // so the most recent comments appear first.
    //        post.comments.unshift(comment._id);
    //        console.log("post:", post);
    //       post.save(); //dont forget to save it once you've edited it locally!
    //        res.redirect("/posts/" + post._id)
    //     }).catch(err => {
    //        console.log(err.message);
    //     });
    //     // .then(comment => {
    //     //     // return User.findById(req.user._id);
    //     // })
    //
    //     // .then(user => {
    //     //     user.comments.unshift(comment);
    //     //     user.save()
    //     })
    };
