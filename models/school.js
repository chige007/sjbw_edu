var mongoose = require('./../db');

var Schema = new mongoose.Schema({
    code: {type: String},
    name: {type: String},
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

var Model = mongoose.model('school', Schema, 'school');
module.exports = Model;