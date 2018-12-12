const Post = require('../models/post')
module.exports = app => {

//ROUTES

//HOME
// app.get('/', (req, res) => {
//     //SEND POSTS
//     Post.find({})
//       .then(posts => {
//         res.render("posts-index", { posts });
//       })
//       .catch(err => {
//         console.log(err.message);
//       });
// })

//HOME

app.get("/", (req, res) => {
  var currentUser = req.user;

  Post.find({})
    .then(posts => {
      res.render("posts-index", { posts, currentUser });
    })
    .catch(err => {
      console.log(err.message);
    });
});

//NEW FORM
app.get('/posts/new', (req, res) => {
    var currentUser = req.user;

    res.render('posts-new', { posts, currentUser });// Redirect to posts

})

// CREATE
app.post('/posts/new', (req, res) => {
  // INSTANTIATE INSTANCE OF POST MODEL
  console.log("req.body:", req.body);
  const post = new Post(req.body);

  post.save()
  .then(() => {
      res.redirect(`/`);
  }).catch(err => {
      console.log(err.message);
  })

});

//DISPLAYS EACH POST
app.get("/posts/:id", function(req, res) {
    var currentUser = req.user;

    // LOOK UP THE POST
    Post.findById(req.params.id).populate('comments')
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
