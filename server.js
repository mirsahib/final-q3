const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const mongo = require("mongodb");

//database setting
var db_url =
  "mongodb+srv://mirsahib24:admin123@test-ry7bt.mongodb.net/final?retryWrites=true&w=majority";
mongoose.connect(db_url, { useNewUrlParser: true });

mongoose.connection.on("error", function(err) {
  console.log(err);
  console.log("Could not connect to mongodb");
});

mongo.MongoClient.connect(db_url, { useNewUrlParser: true }, function(
  err,
  client
) {
  if (err) {
    console.log("Could Not Connect DB");
  } else {
    db = client.db("Test");
  }
});

//bodyparser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//set view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//importing model
const Post = require("./model/post");

app.get("/", (req, res) => {
  res.render("index", { title: "POST Home" });
});

// app.get("/", async (req, res) => {
//   const post = await Post.find({});
//   try {
//     res.render("index", { title: "CRUD Home", posts: post });
//   } catch (error) {
//     //res.status(500);
//     console.log(error);
//   }
// });

app.post("/", (req, res) => {
  var name = req.body.post_title;
  var time = Number(req.body.reading_time);
  var body = req.body.post_text;
  //console.log(typeof time);
  //res.end();
  const post = new Post({
    post_name: name,
    post_time: time,
    post_body: body
  });
  post
    .save()
    .then(() => {
      res.status(201).redirect("/");
      console.log("success");
    })
    .catch(error => {
      res.status(400).json({ error: error });
    });
});
app.get("/single", (req, res) => {
  res.render("single", { title: "Single view" });
});

// app listener
app.listen(process.env.PORT || 3000, () => {
  console.log(`Application is running on ${process.env.PORT || 3000}`);
});