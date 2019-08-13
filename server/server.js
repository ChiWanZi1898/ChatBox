const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
var cookie = require('cookie');
const accountRouter = require('./paths/account');
const chatRouter = require('./paths/history');
const Message = require('./models/Message');
const MessageCounter = require('./models/MessageCounter');

const secret = 'CCCCChat';

const mongo_uri = 'mongodb://localhost/chatbox';
mongoose.connect(mongo_uri, {useNewUrlParser: true}, function (err) {
    if (err) {
        throw err;
    } else {
        console.log(`Connected to DB ${mongo_uri}.`);
    }
});
mongoose.set('useFindAndModify', false);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use('/api/account', accountRouter);
app.use('/api/chat', chatRouter);


app.get('/test', (req, res) => {
    res.status(200).send('Hi!')
});

io.use((socket, next) => {

    if (socket.handshake.headers.cookie) {
        const {token} = cookie.parse(socket.handshake.headers.cookie);
        if (!token) {
            next(new Error('Token not found.'));
        }
        jwt.verify(token, secret, (err, decoded) => {

            if (err) {
                return next(err);
            } else {
                socket.email = decoded.email;
                next();
            }
        });
    } else {
        next(new Error('Cookie not found.'));
    }
});

io.on('connection', (socket) => {
    socket.on('send', (payload) => {
        const {token, content} = JSON.parse(payload);

        if (!token) {
            return;
        }
        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                return next(err);
            } else {
                const email = decoded.email;

                let date = Date.now();

                const message = new Message({email, date, content});

                addMessageSeq(message, (message) => {
                    const payload = JSON.stringify(message);
                    io.emit('broadcast', payload);
                })
            }
        });
    });
});

addMessageSeq = (message, callback) => {
    MessageCounter.findOneAndUpdate(
        {},
        {$inc: {latest: 1}},
        {upsert: true, setDefaultsOnInsert: true},
        (err, docs) => {

            let latestID;
            if (err) {
                next(err);
            } else if (docs) {
                latestID = docs.latest;
            } else {
                latestID = 0;
            }
            message.seq = latestID;
            message.save();
            callback(message);
        }
    );
};

http.listen(8080);
