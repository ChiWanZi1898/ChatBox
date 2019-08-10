const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    email: {type: String, required: true},
    date: {type: Date, default: Date.now},
    content: {type: String, required: true, maxlength: 1000}
});

module.exports = mongoose.model('Message', MessageSchema);