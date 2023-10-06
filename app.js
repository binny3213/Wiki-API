const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://binny3213:Bzs0528Bzs@cluster0.a4gornx.mongodb.net/wikiDB",{ useNewUrlParser: true});

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article",articleSchema);

/////////////// requests Targetting all Articles////////////

app.route("/articles")

//client get request
.get( function(req,res){

    //query our database fetches all articles
    Article.find({}).then(function(foundArticles){
       res.send(foundArticles)
    })
    .catch(function(err){
        res.send(err)
    })
})

//client article post request
.post(function(req,res){

    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });

    //saving the new article if works or loging error if doesnt work
    newArticle.save().then(function(){
        res.send("Successfully added a new article");
    })
    .catch(function(err){
        res.send(err);
    });
    
})

//deleting client article
.delete(function(req,res){

    //deleting all articles from the database
    Article.deleteMany().then(function(){
        res.send("Successfully deleted all articles.");

    })
    .catch(function(err){
        console.log(err);
    });
  
});

/////////////// requests Targetting a specific Article////////////

app.route("/articles/:articleTitle")

.get(function(req,res){

    Article.findOne({title:  req.params.articleTitle})
    .then(function(foundArticle){
        if(foundArticle){
            res.send(foundArticle);
        }
        else{
            res.send("No articles matching that title was found. ")
        }     
    })
    .catch(function(err){
        res.send(err);
    });

})

//update intire version of route
.put(function(req,res){

    Article.updateOne(
        { title: req.params.articleTitle },
        { $set: { title: req.body.title, content: req.body.content } }
      )
        .then(result => {
          if (result.nModified === 0) {
            // Check if no documents were modified
            res.status(404).send("Article not found or no changes were made.");
          } else {
            res.status(200).send("Successfully updated article.");
          }
        })
        .catch(err => {
          res.status(500).send(err.message || "Internal Server Error");
        });
    
})

.patch(function(req,res){

    Article.updateOne(
        { title: req.params.articleTitle },
        { $set:  req.body } 
      )
        .then(result => {
          if (result.nModified === 0) {
            res.status(404).send("Article not found or no changes were made.");
          } else {
            res.status(200).send("Successfully updated the selected article.");
          }
        })
        .catch(err => {
          res.status(500).send(err.message || "Internal Server Error");
        });

})

.delete(function(req,res){

    Article.deleteOne(
        {title: req.params.articleTitle}
    )
    .then(result => {
        if (result.nModified === 0) {
          res.status(404).send("Article not found or no changes were made.");
        } else {
          res.status(200).send("Successfully deleted the selected article.");
        }
      })
      .catch(err => {
        res.status(500).send(err.message || "Internal Server Error");
      });
});


let port = process.env.PORT;

if(port == null || port =="")
    port = 3000;

app.listen(port, function() {
  console.log("Server started on port 3000");
});