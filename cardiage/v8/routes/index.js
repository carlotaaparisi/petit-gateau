var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Project = require("../models/project");

/////////// ROUTING ///////////
router.get("/", function(req, res){
    res.render("coverPage", {message: "error"});
});

router.get("/home", function(req, res){
    //Get all projects from DB:
    Project.find({}, function(err, allProjects){
        if(err){
            console.log(err);
        } else {
            res.render("landing", {projects:allProjects});
        }
    });
});

router.get("/blog", function(req, res){
    res.render("blog");
});


////// AUTH ROUTES ///////
    // show register form
router.get("/register", function(req, res) {
    res.render("register");
});
    //handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to Cardiage " + user.username);
            res.redirect("/home");
        });
    });
});

// Show login form
router.get("/login", function(req, res){
    res.render("login");
});

// handling login logic
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/work",
        failureRedirect: "/login"
    }), function(req, res) {
});

// Logout route
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/home");
});


/////EXPORT
module.exports = router;