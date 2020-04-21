const mongoose = require("mongoose");

const Schema = mongoose.Schema;
let ArticleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  img: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  synopsis: {
    type: String,
    required: true
  },
  favorite: {
    type: Boolean,
    default: false
  },
  comment: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment"
    }
  ]
});
var Article = mongoose.model("Article", ArticleSchema);
module.exports = Article;
