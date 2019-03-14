var mongoose = require('./../db');

var Schema = new mongoose.Schema({
    _id: {type: String},
    sequence_value: {type: Number},
});

var Model = mongoose.model('counters', Schema, 'counters');
module.exports = Model;