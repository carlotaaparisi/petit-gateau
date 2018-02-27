var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose")
    
mongoose.connect("mongodb://localhost/cardiage_app");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

///////// SCHEMA SETUP /////////
///////// PROJECT //////////
var projectSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

//Create a model called "project" (IMP! name it in Singular, 
//DB will create a collection automaticaly in plural. If there's not a collection that matches the name,
//DB will create a new one.)

var Project = mongoose.model("Project", projectSchema);

//CREATE A PROJECT:
//Project.create(
// {
//       name: "London Bus",
//        image: "this is a picture"
//    }, function(err, project){
//        if(err){
//            console.log(err);
//        } else {
//            console.log("New Project Created:");
//            console.log(project);
//        }
//    });

/////////// USER //////////
// USER (REFERENCED) //
var userSchema = new mongoose.Schema({
    email: String,
    name: String,
    // we call the PROJECTS inside the arrey to connect them with the user
    projects: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project"
        }
    ]
});

var User = mongoose.model("User", userSchema);

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
            res.render("work", {projects:allProjects});
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
    // create a new project and save to DB
    // Project.create(newProject, function(err, newlyCreated){
    //     if(err){
    //         console.loog(err);
    //     } else {
    //         // Redirect back to work page:
    //         res.redirect("/work");
    //     }
    // });
    Project.create(newProject, function(newlyCreated){
        User.findOne({email: "c.aparisimartinez@gmail.com"}, function(err, foundUser){
            if(err){
                console.loog(err);
            } else {
                foundUser.projects.push(newlyCreated);
                foundUser.save(function(err, data){
                    if(err){
                      console.log(err);
                  } else {
                      console.log(data);
                      //Redirect back to work page:
                      res.redirect("/work");
                  };
              });
          };
    });
    });
});

//NEW - show form to create new campground
app.get("/work/new", function(req, res){
   res.render("new.ejs"); 
});

// SHOW - shows more info about one project
app.get("/work/:id", function(req, res) {
    // find the project with provided id
    Project.findById(req.params.id, function(err, foundProject) {
        if(err){
            console.log(err);
        } else {
            // render show template with that project
            res.render("show", {project: foundProject});
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

