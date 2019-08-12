const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
var cookie = require('cookie');
const accountRouter = require('./account');
const Message = require('./models/Message');

const secret = 'CCCCChat';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use('/api/account', accountRouter);


app.get('/test', (req, res) => {
   res.status(200).send('Hi!')
});


io.use((socket, next) => {
    console.log(socket.handshake.headers.cookie);
    if (socket.handshake.headers.cookie) {
        const { token }= cookie.parse(socket.handshake.headers.cookie);
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
    } else {
        next (new Error('Cookie not found.'));
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
                message.save();

                const payload = JSON.stringify(message);

                io.emit('broadcast', payload);
            }
        });


    });
});

http.listen(8080);
