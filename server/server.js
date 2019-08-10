const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const User = require('./models/User')

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

const mongo_uri = 'mongodb://localhost/chatbox';
mongoose.connect(mongo_uri, {useNewUrlParser: true}, function(err) {
    if (err) {
        throw err;
    } else {
        console.log(`Connected to DB ${mongo_uri}.`);
    }
});

app.post('/api/register', function(req, res) {
    const { email, password, nickname} = req.body;
    const user = new User({email, password, nickname});

    user.save(function(err) {
        if(err) {
            console.log(err);
            res.status(500).send('Unable to register.')
        } else {
            res.status(200).send('Registered Successfully.')
        }
    })

});


app.listen(8080);
