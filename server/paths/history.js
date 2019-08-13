const express = require('express');
const router = express.Router();

const Message = require('../models/Message');
const authToken = require('./authToken');

router.get('/history', authToken, (req, res) => {
    let {startID, endID} = req.query;

    try {
        startID = parseInt(startID);
        endID = parseInt(endID);
    } catch (err) {
        console.log(err);
        res.sendStatus(400);
    }

    // console.log(startID, endID);

    if (startID === -1 && endID === -1) {
        Message.find({}, null, {
            skip: 0,
            limit: 50,
            sort: {
                seq: -1
            }
        }).then(messages => {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(JSON.stringify(messages));
        })
    } else {
        if (startID === -1 && endID !== -1) startID = endID - 10;
        if (endID === -1 && startID !== -1) endID = startID + 10;

        Message.find({seq: {$gte: startID, $lte: endID}}).then(messages => {
            // console.log(messages);
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(JSON.stringify(messages));
        })
    }

});

module.exports = router;