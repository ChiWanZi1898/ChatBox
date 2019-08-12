const mongoose = require('mongoose');
const MessageCounter = require('./MessageCounter');

const MessageSchema = new mongoose.Schema({
    seq: {type: Number, required: true, unique: true, index: true},
    email: {type: String, required: true},
    date: {type: Date, default: Date.now, required: true},
    content: {type: String, required: true, maxlength: 1000}
});

// MessageCounter.findOneAndUpdate(
//     {},
//     {$inc: {latest: 1}},
//     {upsert: true, setDefaultsOnInsert: true},
//     (err, docs) => {
//
//         let latestID;
//
//         if (err) {
//             next(err);
//         } else if (docs) {
//             latestID = docs.latest;
//         } else {
//             latestID = 0;
//         }
//
//         const message = new Message({email, date, content, seq: latestID});
//         message.save();
//
//         const payload = JSON.stringify(message);
//         io.emit('broadcast', payload);
//     }
// );

// MessageSchema.pre('save', function (next) {
//
//     let latest;
//     const curMessage = this;
//     MessageCounter.findOneAndUpdate(
//         {},
//         {$inc: {latest: 1}},
//         {upsert: true, setDefaultsOnInsert: true},
//         (err, docs) => {
//             if (err) {
//                 next(err);
//             } else if (docs) {
//                 latest = docs.latest;
//             } else {
//                 latest = 0;
//             }
//             console.log(latest);
//             curMessage.seq = latest;
//             next();
//         }
//     );
// });
//
// MessageSchema.pre('save', function (next) {
//    console.log('sec', this.seq);
// });

module.exports = mongoose.model('Message', MessageSchema);