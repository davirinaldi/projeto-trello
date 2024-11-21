const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
    id: String,
    name: String,
    desc: String,
    list: String,
    due: Date,
    labels: [String],
});

module.exports = mongoose.model('Card', cardSchema);
