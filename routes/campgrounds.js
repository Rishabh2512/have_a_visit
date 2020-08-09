var express =require("express");
var router  =express.Router();
var Campground=require("../models/campground")
var middleware = require("../middleware/index.js")


//INDEX- show all data
router.get("/",function(req,res){
	//get all data from DB!!
	console.log(req.user)
	Campground.find({},function(err,campgrounds){
		if(err){
			req.flash("error","Can't access data")
		}else{
			
			res.render("campgrounds/index",{campgrounds:campgrounds,currentUser:req.user});
		}
	})
	
})


//POST - Post request to add data
router.post("/",middleware.isLoggedIn, function(req,res){
	var Name=req.body.name;
	var price=req.body.price;
	var Img=req.body.image;
	var desc=req.body.description;
	var author ={
		id: req.user._id,
		username: req.user.username
	} 
	var newCamp={ name:Name, price:price, image:Img, description: desc, author:author};
	Campground.create(newCamp,function(err,campground){
		if(err){
			console.log("Can't get data from Post Request!!");
		}else{
			req.flash("success","Successfully Added New Campground")
			res.redirect("/campgrounds");
		}
	})
})

//CREATE -show form to add new campground
router.get("/new",middleware.isLoggedIn, function(req,res){
	res.render("campgrounds/new");
})

//SHOW- show a particular data using id
router.get("/:id",function(req,res){
	Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
		if(err){
			console.log("Can't find data ny id! 444")
		}else{
			res.render("campgrounds/show",{campground : foundCampground})
		}
	})
})

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit",middleware.checkOwnership,function(req,res){
	Campground.findById(req.params.id, function(err,foundCampground){
			res.render("campgrounds/edit",{campground : foundCampground})
	})
})



//UPDATE CAMPGROUND ROUTE
router.put("/:id",middleware.checkOwnership, function(req,res){
	//find and update the correct campground
	Campground.findOneAndUpdate(req.body.params,req.body.campground,function(err,updatedCampground){
		if(err){
			res.redirect("/campgrounds")
		}else{
			req.flash("success","Successfully Updated!")
			res.redirect("/campgrounds/"+req.params.id);
		}
	})
	//redurect to the show page
})


//DESTROY CAMPGROUND DESTROY
router.delete("/:id",middleware.checkOwnership, function(req,res){
	Campground.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("/campgrounds")
		}else{
			req.flash("success","Successfully Deleted")
			res.redirect("/campgrounds")
		}
	})
})






module.exports =router;