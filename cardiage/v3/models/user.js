var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

/////////// USER //////////
// USER (REFERENCED) //
var UserSchema = new mongoose.Schema({
    email: String,
    username: String,
    password: String,
    // we call the PROJECTS inside the arrey to connect them with the user
    projects: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project"
        }
    ]
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);