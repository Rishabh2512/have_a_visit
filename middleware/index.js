var Campground= require("../models/campground")

var middlewareObj={}


middlewareObj.isLoggedIn=function(req,res,next){
	if(req.isAuthenticated()){
		return next()
	}
	req.flash("error","You need to be login first");
	res.redirect("/login");
}




middlewareObj.checkOwnership  = function(req,res,next){
	if(req.isAuthenticated()){
			Campground.findById(req.params.id,function(err,foundCampground){
				if(err){
					req.flash("error","Can't Find The Campground")
					res.redirect("back")
				}else{
					//does user owns page
					if(foundCampground.author.id.equals(req.user._id)){
						next();
					}else{
						req.flash("error","You are not authorised user")
						res.redirect("back")
					}
				}
			})
		}else{
			req.flash("error","You need to be login first")
			res.redirect("back")
		}
}



module.exports = middlewareObj;