var mongoose = require('./../db');

var Schema = new mongoose.Schema({
    username: {type: String},
    password: {type: String},
    role_id: {type: String},
    createTime: {
        type: Date,
        default: Date.now
    },
    updateTime: {
        type: Date,
        default: Date.now
    }
},{
    versionKey: false,
    timestamps: { createdAt: 'createTime', updatedAt: 'updateTime' }
});

var Model = mongoose.model('user', Schema, 'user');
module.exports = Model;