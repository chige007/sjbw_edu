var mongoose = require('./../db');

var Schema = new mongoose.Schema({
    username: {type: String},
    password: {type: String},
    role_id: {type: String}
});

var Model = mongoose.model('user', Schema, 'user');
module.exports = Model;