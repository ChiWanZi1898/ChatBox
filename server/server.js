const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cookie = require('cookie');

const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

const accountRouter = require('./account');
const User = require('./models/User');
const authToken = require('./AuthToken');

const secret = 'CCCCChat';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use('/api/account', accountRouter);

app.get('/api/messages', authToken, function(req, res) {
    res.status('200').send({messages: [{message: "haha"}, {message: "heihei"}]});
});

io.use((socket, next) => {


    const cookie_str = socket.request.headers.cookie;
    let cookies = {};
    try {
        cookies = cookie.parse(cookie_str);
    } catch (err) {
        next(err);
    }
    const token = cookies.token;

    if (!token) {
        next(new Error('Token not found.'));
    }

    jwt.verify(token, secret, (err, decoded) => {
        if(err) {
            return next(err);
        } else {
            socket.email = decoded.email;
            next();
        }
    });
});

io.on('connection', (socket) => {
    // TODO https://community.4geeks.co/socket-io-with-token-authentication/

    socket.on('send', (content) => {
        console.log(content, socket.email);
        io.emit('broadcast', content);
    });
});

http.listen(8080);
