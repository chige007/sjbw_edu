var mongoose = require('./../db');

var Schema = new mongoose.Schema({
    _id: {type: String},
    stu_searchBoxTitle: {type: String},
    stu_searchTitle: {type: String},
    acc_searchBoxTitle: {type: String},
    acc_searchTitle: {type: String},
    acc_waterMask: {type: String},
    pro_searchBoxTitle: {type: String},
    pro_searchTitle: {type: String},
    pro_waterMask: {type: String},
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

var Model = mongoose.model('system', Schema, 'system');
module.exports = Model;