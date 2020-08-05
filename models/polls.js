const mongoose = require("mongoose");
require('dotenv').config()

let Schema = mongoose.Schema;

mongoose.connect(process.env.db, { useNewUrlParser: true, useUnifiedTopology: true });

const Polls = new Schema({
    "question": {type: String, required: true},
    "options": [{
        "option": {type: String },
        "votes": {type: Number, default: 0} 
    }],
    "by": {type: String, default: "Admin"},
    "id": String,
    "votedby": {type: Array, default: []}
});

let polls = mongoose.model('polls', Polls);

module.exports = polls;