const Post = require('../models/post')
const User = require('../models/user')

module.exports = app => {

//ROUTES

// HOME
app.get('/', (req, res) => {
    //SEND POSTS
    Post.find({})
      .then(posts => {
        res.render("posts-index", { posts });
      })
      .catch(err => {
        console.log(err.message);
      });
})

// VOTE UP
app.put("/posts/:id/vote-up", (req, res) => {
    Post.findById(req.params.id).exec((err, post) => {
        console.log(post);
        post.upVotes.push(req.user._id);
        post.voteScore = post.voteScore + 1;
        post.save()

        res.status(200)

    });
});

// VOTE DOWN
app.put("/posts/:id/vote-down", (req, res) => {
    Post.findById(req.params.id).exec((err, post) => {
        post.downVotes.push(req.user._id);
        post.voteScore = post.voteScore - 1;
        post.save()

        res.status(200)
    });
});

//HOME
app.get("/", (req, res) => {
  const currentUser = req.user;
  console.log("currentUser:",currentUser);
  Post.find({})
    .populate('author')
    .then(posts => {
      res.render("posts-index", { posts, currentUser });
    })
    .catch(err => {
      console.log(err.message);
    });
});

//NEW FORM
app.get("posts/new", (req, res, post) => {
    var currentUser = req.user;

    res.render('posts-new', { post, currentUser });// Redirect to posts

})

// // CREATE
// app.post('/posts/new', (req, res) => {
//   // INSTANTIATE INSTANCE OF POST MODEL
//   console.log("req.body:", req.body);
//   const post = new Post(req.body);
//
//   post.save()
//   .then(() => {
//       res.redirect(`/`);
//   }).catch(err => {
//       console.log(err.message);
//   })
//
// });

// // CREATE: THIS WORKS FOR ONE COMMENT
// app.post("/posts/new", (req, res) => {
//   if (req.user) {
//     var post = new Post(req.body);
//     var p;
//     post
//       .save()
//       .then(post => {
//         p = post
//         return User.findById(req.user._id);
//       })
//       .then(user => {
//         // user.posts.unshift(post);
//         user.save();
//         // REDIRECT TO THE NEW POST
//         res.redirect("/posts/" + p._id);
//       })
//       .catch(err => {
//         console.log(err.message);
//       });
//     } else {
//         return res.status(401);
//     }
//
// });

// CREATE posts
 app.post('/posts/new', (req, res) => {

     var currentUser = req.user
     if (req.user) {
         post.author = req.user._id;
         // INSTANTIATE INSTANCE OF POST MODEL
         const post = new Post(req.body);
         post.author = req.user._id;
         // SAVE INSTANCE OF USER MODEL TO DB

         post
             .save()
             .then((post) => {
                 return User.findById(post.author);
             })
             .then((user) => {
                 post.comments.unshift(post);
                 user.save();
                 // REDIRECT TO THE NEW POST
                 res.redirect('/posts/' + post._id);
             })
             .catch((err) => {
                 console.log(err.message);
             });
     }
 });

//DISPLAYS EACH POST
app.get("/posts/:id", function(req, res) {
    var currentUser = req.user;

    // LOOK UP THE POST
    Post.findById(req.params.id).populate('comments').populate('author')
    .then((post) => {
      res.render('post-show', { post, currentUser })
    }).catch((err) => {
      console.log(err.message)
    })
});

// SUBREDDIT
app.get("/r/:subreddit", function(req, res) {
    var currentUser = req.user;

Post.find({ subreddit: req.params.subreddit })
  .then(posts => {
    res.render("posts-index", { posts, currentUser });
  })
  .catch(err => {
    console.log(err);
  });
});

};
