var express     = require("express"),
	app         = express(),
    bodyParser  = require("body-parser"),
	mongoose    = require("mongoose"),
	flash       =require("connect-flash"),
	passport    =require("passport"),
	LocalStrategy=require("passport-local"),
	methodOverride=require("method-override"),
	Campground =require("./models/campground"),
	Comment     = require("./models/comment"),
	User        =require("./models/user"),
	seedDB     = require("./seeds");

var commentRoutes    =require("./routes/comments"),
    campgroundRoutes =require("./routes/campgrounds"),
    indexRoutes      =require("./routes/index")

// seedDB(); //no add to db

mongoose.connect("mongodb://localhost:27017/have_a_visit",{
	useNewUrlParser: true ,
	useFindAndModify: false,
    useUnifiedTopology: true
})
.then(()=>console.log("Connect to DB!"))
.catch(error=>console.log(error.message));

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+"\public"));
app.use(methodOverride("_method"));
app.use(flash());
// console.log(__dirname);


//PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "Once again Rusty wins",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser= req.user;
	res.locals.error =req.flash("error");
	res.locals.success =req.flash("success");
	next();
})

//requiring routes
app.use('/', indexRoutes)
app.use("/campgrounds/:id/comments",commentRoutes)
app.use("/campgrounds",campgroundRoutes)

app.listen(5678,function(){
	console.log("The Have_a_Visit Camp Server Is Working!!!!");
})





// save data to database(mongodb) yelp_camp using mongoose


// Campgrounds.create({
// 	name: "Town Hill",
// 	img : "https://images.pexels.com/photos/2589679/pexels-photo-2589679.jpeg?    auto=compress&cs=tinysrgb&h=350",
// 	description: "Happy Place to live!!! Have some time here!"
// },function(err,campground){
// 	if(err){
// 		console.log(err);
// 	}else{
// 		console.log("Newly Item Added to DB!!");
// 		console.log(campground);
// 	}
// })