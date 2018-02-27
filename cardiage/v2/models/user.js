var mongoose = require("mongoose");

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

module.exports = mongoose.model("User", userSchema);