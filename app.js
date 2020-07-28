var express = require('express');
var path = require('path');
var app = express();
var router = express.Router();
let ejs = require('ejs');
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
require('dotenv').config()
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.email,
        pass: process.env.password
    }
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
var underdevelopment = true;
app.set('json spaces', 2);


app.get('/signup', function (req, res) {
    res.render(path.join(__dirname, '/public/views/signup/signup.ejs'))
})

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
    if (underdevelopment) {
        db = await User.find({})
        res.status(200).json(db)
    } else {
        res.status(404);
        res.render(path.join(__dirname, '/public/views/404/index.ejs'), {
            url: req.url
        });
    }
})

app.get('/updatedb', async function (req, res) {
    if (underdevelopment) {
        let user = await User.findOne({});
        await user.save();
        let db = await User.find({})
        res.json(db);
    } else {
        res.status(404);
        res.render(path.join(__dirname, '/public/views/404/index.ejs'), {
            url: req.url
        });
    }
})

// random password generator

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


//updating userID and password

app.get('/updatelogin', async function (req, res) {
    if (underdevelopment) {
        let db = await User.find({});
        db.forEach(async user => {
            var Password = makeid(6);
            var userName = user.name.split(' ').join('').toLowerCase();
            user.username = userName;
            user.password = Password;
            await user.save();
        })
        res.json(db);
    } else {
        res.status(404);
        res.render(path.join(__dirname, '/public/views/404/index.ejs'), {
            url: req.url
        });
    }
})


app.get('/deletedb', async function (req, res) {
    if (underdevelopment) {
        arg = {}
        if (arg === {}) {
            res.send('delete arg cannot be empty');
        } else {
            db = await User.find(arg).remove();
        }
    } else {
        res.status(404);
        res.render(path.join(__dirname, '/public/views/404/index.ejs'), {
            url: req.url
        });
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
            profile: userprofile,
            id: req.params.id
        });
    } else {
        res.send('User Not Found');
    }
})



app.get('/rooms/:id', async function (req, res) {
    var rooms = ['s4', 's7', 's8'];
    var users = await User.find({});
    var people = []
    var index = []
    if (req.params.id === 's8') {
        users.forEach(function (profile) {
            if (profile.roomNumber.toLowerCase() === 's8' || profile.roomNumber === '8') {
                people.push(profile);
                index.push(users.indexOf(profile));
            }
        })
        res.render(path.join(__dirname, 'public/views/rooms/s8.ejs'), {
            profile: people,
            indexes: index
        });
    } else if (req.params.id === 's7') {
        users.forEach(function (profile) {
            if (profile.roomNumber.toLowerCase() === 's7' || profile.roomNumber === '7') {
                people.push(profile);
                index.push(users.indexOf(profile));
            }
        })
        res.render(path.join(__dirname, 'public/views/rooms/s7.ejs'), {
            profile: people,
            indexes: index
        });
    } else if (req.params.id === 's4') {
        users.forEach(function (profile) {
            if (profile.roomNumber.toLowerCase() === 's4' || profile.roomNumber === '4') {
                people.push(profile);
                index.push(users.indexOf(profile));
            }
        })
        res.render(path.join(__dirname, 'public/views/rooms/s4.ejs'), {
            profile: people,
            indexes: index
        });
    } else {
        res.status(404);
        res.render(path.join(__dirname, '/public/views/404/index.ejs'), {
            url: req.url
        });
    }
})

app.get('/broadcast', async function (req, res) {
    let db = await User.find({});
    emails = []
    names = []
    db.forEach(user => {
        if (user.instituteEmail != null) {
            emails.push(user.instituteEmail);
            names.push(user.name);
        }
    })
    res.render(path.join(__dirname, '/public/views/email/email.ejs'), {
        reciepent: emails,
        nameuser: names,
        makeid: function (length) {
            var result = '';
            var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var charactersLength = characters.length;
            for (var i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
        }
    });
})

app.post('/sendemail', async (req, res) => {
    let recipients = Object.values(req.body);
    let subject = req.body.subject;
    let body = req.body.body;
    let username = req.body.username;
    let password = req.body.password;
    let user = await User.findOne({
        'username': username,
        'password': password
    })
    console.log(user)
    if (user === {} || user === null) {
        res.send("Your Username/Password is incorrect, or not registered in the Database.");
    } else {
        const mailOptions = {
            from: process.env.email,
            to: recipients.join(', '), // list of receivers
            subject: subject, // Subject line
            html: body // plain text body
        };
        await transporter.sendMail(mailOptions, function (err, info) {
            if (err)
                console.log(err)
            else
                console.log(info);
        });

        res.send("Your mail has been sent.")
    }
})


app.get('/editprofile/:id', async(req, res) => {
    let user = await User.find({})
    user = user[parseInt(req.params.id)-1]
    console.log(user)
    res.render(path.join(__dirname, '/public/views/editprofile/editprofile.ejs'), {user: user, id: req.params.id})

})

app.post('/changeprofile/:id', async (req, res) => {
    let id = req.params.id;
    let data = req.body;
    let user = await User.findOne({'username': data.username, 'password': data.password})
    if (user===null) {
        res.send('You entered the wrong Username/Password.')
    }
    else {
        Object.keys(data).forEach(m => {
            user[m] = data[m]
        });
        await user.save();
        res.send('Changed your data successfully.')
    }


})

app.use(function (req, res, next) {
    res.status(404);
    res.render(path.join(__dirname, '/public/views/404/index.ejs'), {
        url: req.url
    });
});

app.listen(3000);