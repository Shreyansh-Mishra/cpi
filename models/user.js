//import mongoose
const mongoose = require('mongoose');
var Schema = mongoose.Schema;
require('dotenv').config();
mongoose.connect(process.env.db, { useNewUrlParser: true, useUnifiedTopology: true })

const userData = new Schema({
    name: {type: String, required: true},
    bio: {type: String, default: "Student at IIITV"},
    dob: {type: String, required: true},
    roomNumber: {type: String, required: true},
    codeforces: String,
    codechef: String,
    github: String,
    username: {type: String, default: null},
    password: {type: String, default: null} 
});

var User = mongoose.model('User', userData);
module.exports = User;