var mongoose = require("mongoose");
var Project = require("./models/project");

function seedDB(){
    Project.remove({}, function(err) {
        if(err){
            console.log(err);
        }   else {
            console.log("removed projects");
        }
    });
};

module.exports = seedDB;