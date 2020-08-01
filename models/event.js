//import mongoose
const mongoose = require('mongoose');
var Schema = mongoose.Schema;
require('dotenv').config();
mongoose.connect(process.env.db, { useNewUrlParser: true, useUnifiedTopology: true })

const eventPlanner = new Schema({
    todo: {type: String, required: true},
    by: {type: String, required: true} 
});

var todo = mongoose.model('todo', eventPlanner);
module.exports = todo;