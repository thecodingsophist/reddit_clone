const mongoose = require("mongoose");
const Autopopulate = require('../utilities/autopopulate');
const Schema = mongoose.Schema;
const User = require('../models/user')


const CommentSchema = new Schema({
  content: { type: String, required: true },
  author : { type: Schema.Types.ObjectId, ref: "User", required: true },
  postId    : { type: Schema.Types.ObjectId, ref: "Post", required: true},
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment'}]
}).pre('findOne', Autopopulate('comments'))
    .pre('find', Autopopulate('comments'))

module.exports = mongoose.model("Comment", CommentSchema);
