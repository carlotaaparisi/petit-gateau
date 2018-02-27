var express = require("express");
var router = express.Router();
var Project = require("../models/project");

//INDEX - show all work
router.get("/work", function(req, res){
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
router.post("/work", isLoggedIn, function(req, res){
    //get data from form and add to projects array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newProject = {name: name, image: image, description: desc, author: author}
//    create a new project and save to DB
    Project.create(newProject, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            // Redirect back to work page:
            console.log(newlyCreated);
            res.redirect("/work");
        }
    });
});

//NEW - show form to create new campground
router.get("/work/new", isLoggedIn, function(req, res){
   res.render("projects/new"); 
});

// SHOW - shows more info about one project
router.get("/work/:id", function(req, res) {
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

router.get("/about", function(req, res){
    res.render("about");
});

router.get("/contact", function(req, res){
    res.render("contact");
});

router.get("/legal", function(req, res){
    res.render("legal");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

/////EXPORT
module.exports = router;