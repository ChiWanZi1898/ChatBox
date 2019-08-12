const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const authToken = require('./AuthToken');

const secret = 'CCCCChat';

const mongo_uri = 'mongodb://localhost/chatbox';
mongoose.connect(mongo_uri, {useNewUrlParser: true}, function (err) {
    if (err) {
        throw err;
    } else {
        console.log(`Connected to DB ${mongo_uri}.`);
    }
});

router.post('/register', function (req, res) {
    const {email, password, nickname} = req.body;
    const user = new User({email, password, nickname});

    user.save(function (err) {
        if (err) {
            console.log(err);
            res.status(500).send('Unable to register.')
        } else {
            res.status(200).send('Registered Successfully.')
        }
    })

});

router.post('/login', function (req, res) {
    const {email, password} = req.body;
    User.findOne({email}, function (err, user) {
        if (err) {
            console.log(err);
            res.status(500).json({error: 'Internal error.'});
        } else if (!user) {
            res.status(401).json({error: 'Invalid email or password.'});
        } else {
            user.isValidPassword(password, function (err, same) {
                if (err) {
                    console.log(err);
                    res.status(500).json({error: 'Internal error.'});
                } else if (!same) {
                    res.status(401).json({error: 'Invalid email or password.'});
                } else {

                    const token = jwt.sign({email}, secret, {expiresIn: '1h'});
                    res.cookie('token', token).sendStatus(200);
                }
            })
        }
    });
});

router.get('/user-info', authToken, function(req, res) {
    const { email } = req;
    User.findOne({email}, function (err, user) {
        if (err || !user) {
            res.status(500).json({error: 'Internal error.'});
        } else {
            const nickname = user.nickname;
            const userInfo = {email, nickname};
            const payload = JSON.stringify(userInfo);
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(payload);
        }
    });
});

module.exports = router;