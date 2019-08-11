const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const socketIoCookieParser = require("socket.io-cookie-parser");

const accountRouter = require('./account');
const Message = require('./models/Message');

const secret = 'CCCCChat';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use('/api/account', accountRouter);

io.use(socketIoCookieParser());

io.use((socket, next) => {
    const token = socket.request.cookies.token;

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

    socket.on('send', (content) => {
        let date = Date.now();
        const email = socket.email;

        if (socket.email !== '7@example.com') {
            date = date - new Date(1970, 1, 0) ;
        }

        const message = new Message({email, date, content});
        message.save();

        const payload = JSON.stringify(message);

        io.emit('broadcast', payload);
    });
});

http.listen(8080);
