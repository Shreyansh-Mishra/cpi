var express = require('express');
const http = require('http');
var path = require('path');
var app = express();
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

app.use('/favicon.ico', express.static('public/favicon.ico'));
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
const todo = require('./models/event.js');
const Polls = require('./models/polls.js');
const Resetpassword = require('./models/resetpassword.js');
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
        db2 = await todo.find({})
        db3 = await Polls.find({})
        db4 = await Resetpassword.find({})
        res.status(200)
        res.type('json');
        res.send("User Database:\n\n" + JSON.stringify(db, null, "\t") + "\n\nEvent Database:\n\n" + JSON.stringify(db2, null, "\t") + "\n\nPoll Database:\n\n" + JSON.stringify(db3, null, "\t") + "\n\nReset Password Database:\n\n" + JSON.stringify(db4, null, "\t"))
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
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$-_.+!*(),';
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
            db = await Polls.find(arg).remove();
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
            var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$-_.+!*(),';
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


app.get('/editprofile/:id', async (req, res) => {
    let user = await User.find({})
    user = user[parseInt(req.params.id) - 1]
    console.log(user)
    res.render(path.join(__dirname, '/public/views/editprofile/editprofile.ejs'), {
        user: user,
        id: req.params.id
    })

})

app.post('/changeprofile/:id', async (req, res) => {
    let id = req.params.id;
    let data = req.body;
    let user = await User.find({})
    user = user[id-1];
    if (user===null || user===undefined) {
        res.status(404)
        res.send("User not Found.")
    }
    else {
        if (data.oldusername===user.username) {
            Object.keys(data).forEach(d => {
                user[d]=data[d]
            });
            await user.save();
            res.send("Edited your profile.")
        }
        else {
        res.send("you cannot edit the profile of someone else!")
    }

    }
})

app.get('/addevent', (req, res) => {
    res.render(path.join(__dirname, '/public/views/event/event.ejs'));
})

app.post('/eventpending', async (req, res) => {
    var addTodo = new todo(req.body);


    await addTodo.save(function (err, user) {
        if (err) {
            console.log('error')
        } else {
            res.redirect('/eventplanner')
        }
    })
})

app.get('/eventplanner', async (req, res) => {
    var pending = await todo.find({})
    var eventleft = []
    var name = []
    pending.forEach((ele) => {
        eventleft.push(ele.todo)
        name.push(ele.by)
    })
    res.render(path.join(__dirname, '/public/views/event/pendingevents.ejs'), {
        tpending: eventleft,
        name: name
    })

})

app.get('/polls', async (req, res) => {
    let polls = await Polls.find({});
    res.render(path.join(__dirname, '/public/views/polls/polls.ejs'), {
        polls
    });


})

app.get('/createpoll', (req, res) => {
    res.render(path.join(__dirname, "/public/views/polls/createpoll.ejs"));
})

app.post('/makepoll', async (req, res) => {
    let data = req.body;
    let user = await User.findOne({
        'username': data.username,
        'password': data.password
    });
    if (user === null) {
        res.send("Your Username/Password is incorrect, or not registered in our Database.");
    } else {
        let options = data.options.split('\n');
        data.options = [];
        for (let i = 0; i < options.length; i++) {
            if (options[i] != "\r") {
                data.options[i] = {
                    "option": options[i].replace("\r", "")
                }
            }
        }
        data.by = user.name;
        data.id = makeid(12);
        let addPoll = new Polls(data);
        await addPoll.save((error, user) => {
            if (error) {
                console.log(error);
                res.send('An error has occured while saving your poll.');
            } else {
                res.redirect('/poll/' + data.id);
            }
        })
    }
})

app.get('/poll/:id', async (req, res) => {
    let poll = await Polls.findOne({
        'id': req.params.id
    });

    if (poll === null) {
        res.send("No poll with the ID '" + req.params.id + "' was found.");
    } else {
        let question = poll.question;
        let options = poll.options;
        res.render(path.join(__dirname, '/public/views/polls/viewpoll.ejs'), {
            question,
            options,
            id: req.params.id
        })
    }
})

app.post('/submitpoll', async (req, res) => {
    let data = req.body;
    console.log(data)
    let user = await User.findOne({
        'username': data.username,
        'password': data.password
    })
    if (user === null) {
        res.send('Your Username/Password is wrong or not registered in the database.')
    } else {
        let poll = await Polls.findOne({
            'id': data.id
        })
        if (poll === null) {
            res.send('Poll not found')
        } else {
            if (!poll.votedby.includes(user.name)) {
                option = poll.options.find(x => x.option === data.choice)
                option.votes += 1;
                poll.votedby.push(user.name)
                await poll.save();
                res.redirect('/viewpoll/' + data.id)
            } else {
                res.send('You have already voted for this poll!');
            }
        }
    }
})

app.get('/viewpoll/:id', async (req, res) => {
    res.render(path.join(__dirname + "/public/views/polls/resultform.ejs"), {
        id: req.params.id
    })
})

app.post('/showpoll/:id', async (req, res) => {
    let data = req.body;
    let user = await User.findOne({
        'username': data.username,
        'password': data.password
    })
    if (user === null) {
        res.send('Username/password is incorrect or not registered in our database')
    } else {
        let poll = await Polls.findOne({
            'id': req.params.id
        })
        let votedby = poll.votedby;
        if (votedby.includes(user.name)) {
            res.render(path.join(__dirname, '/public/views/polls/result.ejs'), {
                poll,
                authorised: true
            })
        } else {
            res.send('you have not voted yet, please vote to see the results!')
        }
    }
})

app.get('/keepalive', async (req, res) => {
    res.send('Ping Recieved');
    console.log('Ping Recieved');
})


app.get('/changepassword/:id', async (req, res) => {
    let user = await User.find({});
    user = user[req.params.id-1];
    if (user!=null || user!=undefined) {
        data = {
            'for': user.name,
            'id': makeid(25)
        }   
        let link = new Resetpassword(data);
        await link.save(function (err, link) {
            if (err) {
                console.log("Error: "+err);
            }
            else {
                console.log(link);
            }
        });
        var ip = (req.headers['x-forwarded-for'] || '').split(',').pop().trim() || 
         req.connection.remoteAddress || 
         req.socket.remoteAddress || 
         req.connection.socket.remoteAddress
        const mailOptions = {
            from: process.env.email,
            to: user.instituteEmail,
            subject: 'Password Reset Link for CPI', // Subject line
            html: `
            <h1 style="color: blue;">Password Reset Link for CPI<h1><br>
            <h3 style="color: green;">To reset your password:<h3>
            <a href="${process.env.hosturl}resetpassword/${link.id}"><button>Click Here</button></a>
            <h4 style= "color: red;">If this was not requested by you, please ignore this mail. The Link will automatically expire in 30 Minutes.</h4>
            Request was sent from IP: ${ip}
            ` // plain text body
            
        };
        await transporter.sendMail(mailOptions, function (err, info) {
            if (err)
                console.log(err)
            else
                console.log(info);
        });
        res.send("Please Check your Institute Email to get the link to reset your password.")
    }
    else {
        res.send("User not found.")
    }
})

app.get('/resetpassword/:id', async (req, res) => {
    let link = await Resetpassword.findOne({'id': req.params.id});
    if (link===null) {
        res.send("Your password reset link is wrong, or has expired.");
    }
    else {
        res.render(path.join(__dirname, '/public/views/resetpassword/resetpassword.ejs'), {id: link.id});
    }
})

app.post('/passwordchange', async (req, res) => {
    let data = req.body;
    let id = data.id;
    let link = await Resetpassword.findOne({'id': id});
    if (link===null) {
        res.send("Your password reset link has probably expired, or it was edited.");
    }
    else {
        let name = link.for;
        let user = await User.findOne({'name': name});
        user.password = data.password;
        await user.save();
        await link.remove();
        res.send("Your password has been changed successfully.");
    }
})

app.use(function (req, res, next) {
    res.status(404);
    res.render(path.join(__dirname, '/public/views/404/index.ejs'), {
        url: req.url
    });
});



app.listen(3000);
setInterval(() => {
    http.get(`http://localhost:3000/keepalive`);
  }, 30000);