const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  post_name: { type: String, required: true },
  post_time: { type: Number, required: true },
  post_body: { type: String, required: true }
});

module.exports = mongoose.model("Post", postSchema);
