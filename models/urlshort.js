const mongoose = require('mongoose')

const UrlSchema = mongoose.Schema({
    longUrl: {
        type: String,
        required: true
    },
    shortUrl: {
        type: String,
        unique: true,
        index: true // Add an index to improve query performance
    },
    clickCount: {
        type: Number,
        default: 0
    }
});

const UrlModel = mongoose.model('UrlModel', UrlSchema);

module.exports = { UrlModel };  //object destructuring`