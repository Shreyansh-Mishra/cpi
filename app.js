var express = require('express');
var path = require('path');
var app = express();
var router = express.Router();
let ejs = require('ejs');
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
var underdevelopment = false;
app.set('json spaces', 2);


const User = require('./models/user.js');

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', function (req, res) {
    res.render(path.join(__dirname, '/public/views/index/index.ejs'));
});

app.get('/form', function (req, res) {
    res.render(path.join(__dirname, '/public/views/form/form.ejs'));
})

app.get('/showdb', async function (req, res) {
    if(underdevelopment){
    db = await User.find({})
    res.json(db)
    }
    else{
        res.status(404);
    res.render(path.join(__dirname, '/public/views/404/index.ejs'), {url: req.url});
    }
})

app.get('/updatedb', async function (req, res) {
    if(underdevelopment){
    const filter = {'name': 'Vikrant Kumar'};
    const update = {'dob': '03-03-2002'};
    if(filter==={}){
        res.send('no filter was provided.')
    }
    else {
    let doc = await User.findOneAndUpdate(filter, update, {
        useFindAndModify: false,
        new: true
    });
    db = await User.find({})
    res.json(db)
}
}
else{
    res.status(404);
    res.render(path.join(__dirname, '/public/views/404/index.ejs'), {url: req.url});
}
})

app.get('/deletedb', async function(req, res) {
    if(underdevelopment){
    arg = {}
    if (arg==={}) {
        res.send('delete arg cannot be empty');
    }
    else {
        db = await User.find(arg).remove();
    }
}
else{
    res.status(404);
    res.render(path.join(__dirname, '/public/views/404/index.ejs'), {url: req.url});
}
})

app.post('/submitform', (req, res) => {
    var post = new User(req.body);
    console.log(req.body)
    post.save(function (err, user) {
        if (err) console.log(err);
        return res.send("Success! Your post has been saved.");
    });
});

app.get('/profile/:id', async function (req, res) {
    var users = await User.find({});
    var userprofile = users[parseInt(req.params.id) - 1];
    if (userprofile) {
        res.render(path.join(__dirname, '/public/views/profile/profile.ejs'), {
            profile: userprofile
        });
    } else {
        res.send('User Not Found');
    }
})



app.get('/rooms/:id',async function(req,res){
    var rooms = ['s4' , 's7', 's8'];
    var users = await User.find({});
    var people = []
    if(req.params.id==='s8'){
    users.forEach(function(profile){
        if(profile.roomNumber.toLowerCase()==='s8' || profile.roomNumber==='8'){
            people.push(profile);
        }
    })
res.render(path.join(__dirname, 'public/views/rooms/s8.ejs'),{profile: people});
    }
    else if(req.params.id==='s7'){
        users.forEach(function(profile){
            if(profile.roomNumber.toLowerCase()==='s7' || profile.roomNumber==='7'){
                people.push(profile);
            }
        })
    res.render(path.join(__dirname, 'public/views/rooms/s7.ejs'),{profile: people});
    }

    else if(req.params.id==='s4'){
        users.forEach(function(profile){
            if(profile.roomNumber.toLowerCase()==='s4' || profile.roomNumber==='4'){
                people.push(profile);
            }
        })
    res.render(path.join(__dirname, 'public/views/rooms/s4.ejs'),{profile: people});
    }

    else{
        res.status(404);
        res.render(path.join(__dirname, '/public/views/404/index.ejs'), {url: req.url});
    }
})






app.use(function(req, res, next){
    res.status(404);
    res.render(path.join(__dirname, '/public/views/404/index.ejs'), {url: req.url});
  });

app.listen(3000);