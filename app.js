var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyparser = require("body-parser");
var methodOverride = require("method-override");

// >>>>>>>>>> APP CONFIG <<<<<<<<<<<<<<<<<<<<<<
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
mongoose.connect("mongodb://localhost/blog_app",{useNewUrlParser:true});

// ========================================
        //    SETTING SCHEMA
// ========================================
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created : {type:Date, default:Date.now}
});

var Blog = mongoose.model("Blog",blogSchema);


// >>>>>>>>>>>>>>> HOME ROUTE <<<<<<<<<<<<<<<
app.get("/",function(req,res){
    res.redirect("/blogs");
});


// >>>>>>>>>>>>>> INDEX ROUTE <<<<<<<<<<<<<<<
app.get("/blogs",function(req,res){
    Blog.find({},function(err,blogs){
        if(err) {
            console.log("ERROR !!");
        } else {
            res.render("index.ejs",{blogs : blogs});
        }
    });
});

// >>>>>>>>>>>> NEW ROUTE <<<<<<<<<<<<<<<<<
app.get("/blogs/new",function(req,res){
    res.render("new.ejs");
});

// >>>>>>>>>>> CREATE ROUTE <<<<<<<<<<<<<<
app.post("/blogs",function(req,res){
    Blog.create(req.body.blog,function(err,newblog){
        if(err) {
            res.redirect("/blogs/new");
        } else {
            res.redirect("/blogs");
        }
    });
});

// >>>>>>>>>>>>> SHOW ROUTE <<<<<<<<<<<<<<<<<
app.get("/blogs/:id",function(req,res){
    Blog.findById(req.params.id,function(err,foundblog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("show.ejs",{blog : foundblog});
        }
    });
});

// >>>>>>>>>>>>> EDIT ROUTE <<<<<<<<<<<<<<<<<<<<<
app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(err,foundblog){
        if(err) {
            res.redirect("/blogs");
        } else {
            res.render("edit.ejs",{blog:foundblog});
        }
    });
});

// >>>>>>>>>>>> UPDATE ROUTE <<<<<<<<<<<<<<<<<<
app.put("/blogs/:id",function(req,res){
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updateBlog){
        if(err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

// >>>>>>>>>>>> DELETE ROUTE <<<<<<<<<<<<
app.delete("/blogs/:id",function(req,res){
    Blog.findByIdAndRemove(req.params.id,function(err){
        if(err) {
            res.redirect("/blogs");
        } else{
            res.redirect("/blogs");
        }
    });
});

app.listen(3000,function(req,res){
    console.log("Server has started for blog app");
});
    