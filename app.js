var express = require('express');
var path = require('path');
var app= express();
var router = express.Router();
let ejs = require('ejs');
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const Post = require('./models/user.js');

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/',function(req,res){
    res.render(path.join(__dirname,'/public/views/index/index.ejs'));
});

app.get('/form',function(req,res) {
    res.render(path.join(__dirname,'/public/views/form/form.ejs'));
})

app.get('/showdb', async function(req,res) {
    db = await Post.find({'bio': 'pro at csgo'})
    res.send(db)
})

app.post('/submitform', (req, res) => {
    var post = new Post(req.body);
    console.log(req.body)
    post.save(function(err, user) {
        if(err) console.log(err);
        return res.send("Success! Your post has been saved.");
    });
});


app.listen(3000);