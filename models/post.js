const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('../models/user')
const Comment = require("../models/comment.js");
const Autopopulate = require('../utilities/autopopulate');


mongoose.connect('mongodb://localhost/reddit-db');
// const Post = require('./post.js');

const PostSchema = new Schema({
  createdAt: { type: Date },
  updatedAt: { type: Date },
  title: { type: String, required: true },
  url: { type: String, required: true },
  summary: { type: String, required: true },
  subreddit: { type: String, required: true },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  author : { type: Schema.Types.ObjectId, ref: "User", required: true },
  upVotes :   [{ type: Schema.Types.ObjectId, ref: "User" }],
    downVotes:  [{ type: Schema.Types.ObjectId, ref: "User" }],
    voteScore:  { type: Number, default: 0 },

}).pre('findOne', Autopopulate('comments'))
	.pre('find', Autopopulate('comments'));

PostSchema.pre("save", function(next) {
    const now = new Date();
    this.updatedAt = now;

    if (!this.createdAt) {
        this.createdAt = now;
    }

    next();

});


module.exports = mongoose.model("Post", PostSchema);
