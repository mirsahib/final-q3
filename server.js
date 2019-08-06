const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const mongo = require("mongodb");
const expressValidator = require("express-validator");

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

//setting static folder
app.use(express.static(path.join(__dirname, "public")));

//importing model
const Post = require("./model/post");

//setting express validator middleware
app.use(expressValidator());

app.get("/", (req, res) => {
  res.render("index", { title: "POST Home" });
});

app.post("/", (req, res) => {
  var name = req.body.post_title;
  var time = Number(req.body.reading_time);
  var body = req.body.post_text;
  req.checkBody("reading_time", "Reading length should be numeric").isNumeric();
  req
    .checkBody("reading_time", "Reading length must be above 1 minute")
    .isInt({ gt: 1 });
  const errors = req.validationErrors();
  if (errors) {
    res.render("index", { title: "Post Home", errors: errors });
  } else {
    const post = new Post({
      post_name: name,
      post_time: time,
      post_body: body
    });
    post
      .save()
      .then(() => {
        res.status(201).redirect("/post");
        console.log("success");
      })
      .catch(error => {
        res.status(400).json({ error: error });
      });
  }
});
app.get("/post", async (req, res) => {
  const post = await Post.find({});
  try {
    res.render("post", { title: "Post", posts: post });
  } catch (error) {
    console.log(error);
  }
});
app.get("/post/:id", async (req, res) => {
  var singlePost = await Post.findById(req.params.id);
  try {
    //console.log(singleUser);
    res.render("single", { title: "Single User", posts: singlePost });
  } catch (error) {
    console.log(error);
  }
});

// app listener
app.listen(process.env.PORT || 3000, () => {
  console.log(`Application is running on ${process.env.PORT || 3000}`);
});
