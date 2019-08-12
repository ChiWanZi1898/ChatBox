const mongoose = require('mongoose');

const MessageCounterSchema = new mongoose.Schema({
    latest: {type: Number, required: true, default: 0},
});

module.exports = mongoose.model('MessageCounter', MessageCounterSchema);