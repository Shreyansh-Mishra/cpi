//import mongoose
const mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.connect("your db link", { useNewUrlParser: true })
const userData = new Schema({
    name: {type: String, required: true},
    bio: {type: String, default: "Student at IIITV"},
    dob: {type: String, required: true},
    roomNumber: {type: String, required: true},
    codeforces: String,
    codechef: String,
    github: String


 
});

var Post = mongoose.model('Post', userData);
module.exports = Post;