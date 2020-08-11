const mongoose = require('mongoose');
var Schema = mongoose.Schema;
require('dotenv').config();
mongoose.connect(process.env.db, { useNewUrlParser: true, useUnifiedTopology: true })

const blog = new Schema({
    post: {type: String, required: true},
    by: {type: String, required: true},
    date: {type: Date, default: Date.now},
    id: {type: String}
});

var Blog = mongoose.model('blog', blog);
module.exports = Blog;
