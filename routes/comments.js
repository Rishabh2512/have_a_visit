var express =require("express");
var router  =express.Router({mergeParams: true});
var Campground=require("../models/campground")
var Comment=require("../models/comment")
var middleware = require("../middleware/index.js")


//comments new
router.get("/new",middleware.isLoggedIn,function(req,res){
	Campground.findById(req.params.id,function(err,campground){
		if(err){
			req.flash("error","Undefined Error")
		}else{
			
			res.render("comments/new",{campground:campground})
		}
	})
})

//comments logic 
router.post("/",middleware.isLoggedIn,function(req,res){
	Campground.findById(req.params.id,function(err,campground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		}else{
			Comment.create(req.body.comment,function(err,comment){
				if(err){
					req.flash("error","Undefined Error")
				}else{
					//add username to the comment
					comment.author.id= req.user._id;
					comment.author.username=req.user.username;
					//save comment
					comment.save();
					campground.comments.push(comment);
					campground.save();
					console.log(comment);
					req.flash("successs","Successfully Added Comment")
					res.redirect("/campgrounds/"+campground._id);
				}
			})		
		}
	})
})



module.exports =router;