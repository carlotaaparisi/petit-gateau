var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    LocalStrategy   = require("passport-local"),
    methodOverride  = require("method-override"),
    
    ///////// SCHEMA SETUP /////////
    Project     = require("./models/project"),
    User        = require("./models/user"),
    seedDB      = require("./seeds")
    
    ///////// ROUTES /////////
var workRoutes  = require("./routes/work"),
    indexRoutes = require("./routes/index")

mongoose.connect("mongodb://localhost/cardiage_app");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
//seedDB();

// passport configuration
app.use(require("express-session")({
    secret: "Llopis is the best dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

////IMPORT ROUTERS
app.use(workRoutes);
app.use(indexRoutes);

////ERROR ROUTE
app.get("*", function(req, res){
    res.render("error");
});



////////// SERVER LISTENER ///////////
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server has started!")
});

