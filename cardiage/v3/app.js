var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    LocalStrategy   = require("passport-local"),
    
    ///////// SCHEMA SETUP /////////
    Project     = require("./models/project"),
    User        = require("./models/user"),
    seedDB      = require("./seeds")

mongoose.connect("mongodb://localhost/cardiage_app");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
seedDB();

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


/////////// ROUTING ///////////
app.get("/", function(req, res){
    res.render("coverPage");
});

//app.get("/home", function(req, res){
//    res.render("landing");
//});
app.get("/home", function(req, res){
    //Get all projects from DB:
    Project.find({}, function(err, allProjects){
        if(err){
            console.log(err);
        } else {
            res.render("landing", {projects:allProjects});
        }
    });
});

app.get("/blog", function(req, res){
    res.render("blog");
});

//INDEX - show all work
app.get("/work", function(req, res){
    //Get all projects from DB:
    Project.find({}, function(err, allProjects){
        if(err){
            console.log(err);
        } else {
            res.render("projects/work", {projects:allProjects});
        }
    });
});

//CREATE - add new project to DB
app.post("/work", isLoggedIn, function(req, res){
    //get data from form and add to projects array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newProject = {name: name, image: image, description: desc}
//    create a new project and save to DB
    Project.create(newProject, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            // Redirect back to work page:
            res.redirect("/work");
        }
    });
    // Project.create(newProject, function(newlyCreated){
    //     User.findOne({email: "c.aparisimartinez@gmail.com"}, function(err, foundUser){
    //         if(err){
    //             console.log(err);
    //         } else {
    //             foundUser.projects.push(project._id);
    //             foundUser.save(function(err, data){
    //                 if(err){
    //                   console.log(err);
    //               } else {
    //                   console.log(data);
    //                   //Redirect back to work page:
    //                   res.redirect("/work");
    //               };
    //           });
    //       };
    // });
    // });
});

//NEW - show form to create new campground
app.get("/work/new", isLoggedIn, function(req, res){
   res.render("projects/new"); 
});

// SHOW - shows more info about one project
app.get("/work/:id", function(req, res) {
    // find the project with provided id
    Project.findById(req.params.id, function(err, foundProject) {
        if(err){
            console.log(err);
        } else {
            // render show template with that project
            res.render("projects/show", {project: foundProject});
        }
    });
});

app.get("/about", function(req, res){
    res.render("about");
});

app.get("/contact", function(req, res){
    res.render("contact");
});

app.get("/legal", function(req, res){
    res.render("legal");
});


// AUTH ROUTES
// show register form
app.get("/register", function(req, res) {
    res.render("register");
});
//handle sign up logic
app.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/home");
        });
    });
});

// Show login form
app.get("/login", function(req, res) {
    res.render("login");
});
// handling login logic
app.post("/login", passport.authenticate("local",
    {
        successRedirect: "/home",
        failureRedirect: "/login"
    }), function(req, res) {
});
// Logout route
app.get("/route", function(req, res) {
    req.logout();
    res.redirect("/home");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


// ERROR ROUTE
app.get("*", function(req, res){
    res.render("error");
});


////////// SERVER LISTENER ///////////
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server has started!")
});

