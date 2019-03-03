var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userSchema = new Schema({
    username: String,
    password: String,
    role_id: String
});
var User = mongoose.model('user', userSchema, 'user');
module.exports = User;