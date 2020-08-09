const mongoose = require('mongoose');
require('dotenv').config();

let Schema = mongoose.Schema;

mongoose.connect(process.env.db, { useNewUrlParser: true, useUnifiedTopology: true });

const Resetpassword = new Schema({
    'id': String,
    'for': String,
    expire_at: {type: Date, default: Date.now, expires: 1800}
});

let resetpassword = mongoose.model('resetpassword', Resetpassword);

module.exports = resetpassword;