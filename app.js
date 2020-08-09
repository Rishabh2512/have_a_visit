
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
//mongodb+srv://Rishabh2512:<password>@cluster0.tfod7.mongodb.net/<dbname>?retryWrites=true&w=majority
mongoose.connect("mongodb+srv://Rishabh2512:Rishabh25@@cluster0.tfod7.mongodb.net/Have_a_Visit?retryWrites=true&w=majority",{
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

var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Have_a_Visit Server started!");
});



