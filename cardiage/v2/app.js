var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    ///////// SCHEMA SETUP /////////
    Project     = require("./models/project"),
    User        = require("./models/user"),
    seedDB      = require("./seeds")

mongoose.connect("mongodb://localhost/cardiage_app");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
seedDB();




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
app.post("/work", function(req, res){
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
app.get("/work/new", function(req, res){
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

app.get("*", function(req, res){
    res.render("error");
});




////////// SERVER LISTENER ///////////
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server has started!")
});

