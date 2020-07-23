var express = require('express');
var path = require('path');
var app= express();
let ejs = require('ejs');
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/',function(req,res){
    
    res.render(path.join(__dirname,'/public/views/index.ejs'));
});

app.listen(3000);