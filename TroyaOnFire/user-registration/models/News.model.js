const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NewsSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    postType: {
      type: String,
        required: true,
    },
    postTitle: {
      type: String,
      required: true,
    },
    postDescription: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, collection: 'news-posts' } // Specify collection name
);

const News = mongoose.model("news", NewsSchema);
module.exports = News;