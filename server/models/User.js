const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;


const UserSchema = new mongoose.Schema({
    email: {type: String, required: true, unique: true, maxlength: 32},
    password: {type: String, required: true},
    nickname: {type: String, maxlength: 32}
});

UserSchema.pre('save', function (next) {

    if (this.isNew || this.isModified(password)) {

        const curUser = this;
        bcrypt.hash(curUser.password, saltRounds, function (err, hashedPassword) {
            if (err) {
                next(err);
            } else {
                curUser.password = hashedPassword;
                next();
            }
        })
    } else {
        next();
    }
});

UserSchema.pre('save', function(next) {
    if (this.nickname === '') {
        this.nickname = this.email;
    }
    next();
});

UserSchema.methods.isValidPassword = function (password, callback) {
    bcrypt.compare(password, this.password, function (err, same) {
        if (err) {
            callback(err);
        } else {
            callback(err, same);
        }
    })
};

module.exports = mongoose.model('User', UserSchema);