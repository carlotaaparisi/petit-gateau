var mongoose = require("mongoose");

///////// PROJECT //////////
var projectSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
});

//Create a model called "project" (IMP! name it in Singular, 
//DB will create a collection automaticaly in plural. If there's not a collection that matches the name,
//DB will create a new one.)

module.exports = mongoose.model("Project", projectSchema);

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

