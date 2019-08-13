const jwt = require('jsonwebtoken');

const secret = 'CCCCChat';

const authToken = function (req, res, next) {
    const token = req.body.token || req.query.token || req.headers['x-access-token'] || req.cookies.token;

    if (!token) {
        res.sendStatus(401);
    } else {
        jwt.verify(token, secret, function (err, decoded) {
            if (err) {
                res.sendStatus(401);
            } else {
                req.email = decoded.email;
                next();
            }
        })
    }
};

module.exports = authToken;