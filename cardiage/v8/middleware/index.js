var Project = require("../models/project");
//all the middleware goes here
var middlewareObj = {};

middlewareObj.checkProjectOwnership = function(req, res, next) {
     // is user logged in?
    if(req.isAuthenticated()){
        Project.findById(req.params.id, function(err, foundProject){
            // otherwise, redirect
            if(err || !foundProject){
                req.flash("error", "Project not found");
                res.redirect("/work");
            }   else    {
                // does user own the project?
                    //(.equals() is a Mangoose method to compare foundProject, which is an "object";
                    //and req.user._id, which is a "String").
                if(foundProject.author.id.equals(req.user._id)) {
                    next();
                }   else    {
                     // if not, redirect
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("/home");
                }
            }
        });
    }   else    {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("/login");
    }
}

//and include all the middleware of the project, for example
//comments, but we don't have comments right now:

//middlewareObj.checkCommentOwnership = function(){}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that.");
    res.redirect("/login");
}

module.exports = middlewareObj;