var express = require('express');
var path = require('path');
var app= express();
let ejs = require('ejs');
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/',function(req,res){
    res.render(path.join(__dirname,'/public/views/index/index.ejs'));
});

app.get('/form',function(req,res) {
    res.render(path.join(__dirname,'/public/views/form/form.ejs'));
}) 

app.listen(3000);