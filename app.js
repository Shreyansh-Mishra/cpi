//import node modules
var express = require('express');
const http = require('http');
var path = require('path');
var app = express();
let ejs = require('ejs');
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');

//use dotenv module to hide secret variables in .env file
require('dotenv').config();

//create an email transporter
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.email,
        pass: process.env.password
    }
});

//set the Title Logo for the website
app.use('/favicon.ico', express.static('public/favicon.ico'));

//make express use bodyParser module's json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

//variable used while under development, to perform actions on Database
var underdevelopment = false;

//use for sending beautified JSON data
app.set('json spaces', 2);
//import MongoDB Models
const User = require('./models/user.js');
const todo = require('./models/event.js');
const Polls = require('./models/polls.js');
const Resetpassword = require('./models/resetpassword.js');
const Blog = require('./models/blog.js');
//set render engine to ejs
app.set('view engine', 'ejs');

//make public a static directory
app.use(express.static('public'));

//render homepage
app.get('/', function (req, res) {
    res.render(path.join(__dirname, '/public/views/index/index.ejs'));
});
//render registration page
app.get('/form', function (req, res) {
    res.render(path.join(__dirname, '/public/views/form/form.ejs'));
})

//displays JSON all the MongoDB Models, only when underdevelopment is true
app.get('/showdb', async function (req, res) {
    if (underdevelopment) {
        db = await User.find({})
        db2 = await todo.find({})
        db3 = await Polls.find({})
        db4 = await Resetpassword.find({})
        db5 = await Blog.find({})
        res.status(200)
        res.type('json');
        res.send("User Database:\n\n" + JSON.stringify(db, null, "\t") + "\n\nEvent Database:\n\n" + JSON.stringify(db2, null, "\t") + "\n\nPoll Database:\n\n" + JSON.stringify(db3, null, "\t") + "\n\nReset Password Database:\n\n" + JSON.stringify(db4, null, "\t") + "\n\nBlog Database:\n\n" + JSON.stringify(db5, null, "\t"))
    } else {
        res.status(404);
        res.render(path.join(__dirname, '/public/views/404/index.ejs'), {
            url: req.url
        });
    }
})

//used to update Database Documents, only when underdevelopment is true
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

// random password/id generator
function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$-_.+!*(),';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


//updates userID and password, assigns an username and a random password to every user.
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

//used to delete a MongoDB Document, only when underdevelopment is true
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

//handles registration form's post to create a new user in the MongoDB Model
app.post('/submitform', (req, res) => {
    var post = new User(req.body);
    console.log(req.body)
    post.save(function (err, user) {
        if (err) console.log(err);
        return res.send("Success! Your post has been saved.");
    });
});

//render profile page of an user
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

//render room pages
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

//render Email Broadcast Page, used to send emails
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

//Handle the post request after submitting the email form, to send an email
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

//renders the page to edit a user's profile
app.get('/editprofile/:id', async (req, res) => {
    let user = await User.find({})
    user = user[parseInt(req.params.id) - 1]
    console.log(user)
    res.render(path.join(__dirname, '/public/views/editprofile/editprofile.ejs'), {
        user: user,
        id: req.params.id
    })

})

//handles the post request for the profile editing page form
app.post('/changeprofile/:id', async (req, res) => {
    let id = req.params.id;
    let data = req.body;
    let user = await User.find({})
    user = user[id - 1];
    if (user === null || user === undefined) {
        res.status(404)
        res.send("User not Found.")
    } else {
        if (data.oldusername === user.username && data.oldpassword === user.password) {
            Object.keys(data).forEach(d => {
                user[d] = data[d]
            });
            await user.save();
            res.send("Edited your profile.")
        } else {
            res.send("you cannot edit the profile of someone else!")
        }

    }
})

//renders form to add a new TO-DO to the Event Planner
app.get('/addevent', (req, res) => {
    res.render(path.join(__dirname, '/public/views/event/event.ejs'));
})

//handles the data recieved to create a new Document in the eventplanner database
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
//renders the event planner
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

//renders the polls page, allowing to vote or check the results of a poll
app.get('/polls', async (req, res) => {
    let polls = await Polls.find({});
    res.render(path.join(__dirname, '/public/views/polls/polls.ejs'), {
        polls
    });


})

//renders the form to create a poll
app.get('/createpoll', (req, res) => {
    res.render(path.join(__dirname, "/public/views/polls/createpoll.ejs"));
})
//recieves data from the form and makes a new document inside the Database for the poll
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

//displays a poll with a specific id, allowing to vote
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

//handles vote requests
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

//renders form to view the poll results
app.get('/viewpoll/:id', async (req, res) => {
    res.render(path.join(__dirname + "/public/views/polls/resultform.ejs"), {
        id: req.params.id
    })
})

//displays the poll results after checking if the user is authenticated to view the results
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

//a page to keep the server online, this page gets pinged every 30 seconds so that the server doesn't die on services like glitch.com and repl.it
app.get('/keepalive', async (req, res) => {
    res.send('Ping Recieved');
    console.log('Ping Recieved');
})

//generates a password change link and sends it to the user's email address
app.get('/changepassword/:id', async (req, res) => {
    let user = await User.find({});
    user = user[req.params.id - 1];
    if (user != null || user != undefined) {
        data = {
            'for': user.name,
            'id': makeid(25)
        }
        let link = new Resetpassword(data);
        await link.save(function (err, link) {
            if (err) {
                console.log("Error: " + err);
            } else {
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
    } else {
        res.send("User not found.")
    }
})

//render the form used to reset password, after checking if the link is correct
app.get('/resetpassword/:id', async (req, res) => {
    let link = await Resetpassword.findOne({
        'id': req.params.id
    });
    if (link === null) {
        res.send("Your password reset link is wrong, or has expired.");
    } else {
        res.render(path.join(__dirname, '/public/views/resetpassword/resetpassword.ejs'), {
            id: link.id
        });
    }
})

//handle the new password received from the form, and change the user's password to it
app.post('/passwordchange', async (req, res) => {
    let data = req.body;
    let id = data.id;
    let link = await Resetpassword.findOne({
        'id': id
    });
    if (link === null) {
        res.send("Your password reset link has probably expired, or it was edited.");
    } else {
        let name = link.for;
        let user = await User.findOne({
            'name': name
        });
        user.password = data.password;
        await user.save();
        await link.remove();
        res.send("Your password has been changed successfully.");
    }
})

/*Code for shitposting section starts here*/


app.post('/postblog', async (req, res) => {
    var data = req.body;
    var username = data.username;
    var password = data.password;
    var user = await User.findOne({
        'username': username,
        'password': password
    });
    if (user === null) {
        res.send('username/password is wrong or you are not registered in our database');
    } else {
        var by = user.name;
        var id = makeid(30);
        data.id = id;
        data.by = by;
        var blog = new Blog(data);
        await blog.save((err, data) => {
            if (err) {
                console.log("Error: " + err);
            } else {
                console.log(data);
            }
        });
        res.redirect('/viewblog');
    }
})

app.get('/viewblog', async (req, res) => {
    var blog = await Blog.find({});
    var users = await User.find({});
    res.render(path.join(__dirname, '/public/views/blog/blog.ejs'), {
        blog,
        users
    });
})

app.get('/deleteblog/:id', async (req, res) => {
    var id = req.params.id;
    res.render(path.join(__dirname, '/public/views/blog/deleteblog.ejs'), {
        id
    })
})

app.post('/blogdelete/:id', async (req, res) => {
    var data = req.body;
    var post = await Blog.findOne({
        'id': req.params.id
    });
    if (post === null) {
        res.send('Post does not exist');
    } else {
        var user = await User.findOne({
            'username': data.username,
            'password': data.password,
            'name': post.by
        });

        console.log(user);

        if (user === null) {
            res.send("You are not allowed to edit this post!")
        } else {
            await post.remove();
            res.redirect('/viewblog')
        }
    }

})

/*Code for shitposting section ends here*/


//render 404 page, if the requested URL is wrong or doesn't exist on the server 
app.use(function (req, res, next) {
    res.status(404);
    res.render(path.join(__dirname, '/public/views/404/index.ejs'), {
        url: req.url
    });
});

//listen on port 3000
app.listen(3000, () => console.log("Listening on Port 3000"));

//keep pinging /keepalive every 30 seconds to keep the server alive on services like glitch.com and repl.it
setInterval(() => {
    http.get(`http://localhost:3000/keepalive`);
}, 30000);