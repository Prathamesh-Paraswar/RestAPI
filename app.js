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
mongoose.connect('mongodb://localhost:27017/WikiDB', {useNewUrlParser: true,useUnifiedTopology: true});

const articleSchema=mongoose.Schema({
    title:String,
    content:String
})
const art=mongoose.model("Article",articleSchema);


app.route("/articles")
  .get(function(req,res)
  {
      art.find({},function(err,result)
      {
        if(!err)
        {
            res.send(result)
        }
        else{
            res.send(err)
        }
      })
  })
  .post(function(req,res)
  {
    const arti=new art({
      title:req.body.title,
      content:req.body.content
    })
    arti.save(function(err)
    {
      if(!err)
      {
        res.send("Successfully send the data.")
      }
      else{
        res.send("There is problem in sending data.")
      }
    });
  })
  .delete(function(req,res)
  {
      art.deleteMany({},function(err)
      {
        if(!err)
        {
          res.send("Deleted data successfully")
        }
        else{
          res.send(err)
        }
      })
  })


app.route("/articles/:article_name")
    .get(function(req,res)
    {
        art.findOne({title:req.params.article_name},function(err,r)
        {
          if(!err)
          {
            res.send(r)
          }
          else{
            res.send("No title matching that title is found.");
          }
        })
    })
    .put(function(req,res)
    {
      art.update(
      {title:req.params.article_name},
      {
        title:req.body.title,
        content:req.body.content
      },
      {overwrite:true},
      function(err)
      {
        if(!err)
        {
          res.send("Successfully updated the data.")
        }
      })
    })
    .patch(function(req,res)
    {
      art.update(
        {title:req.params.article_name},
        {
          $set:req.body
        },
        function(err)
        {
          if(!err)
          {
            res.send("Patched successfully.")
          }
          else{
            res.send("Not possible..")
          }
        }
      )
    })
    .delete(function(req,res)
    {
      art.deleteOne({title:req.params.article_name},function(err)
      {
        if(!err)
        {
          res.send("Data deleted successfully!!")
        }
        else{
          res.send(err)
        }
      })
    })



app.listen(3000, function() {
  console.log("Server started on port 3000");
});