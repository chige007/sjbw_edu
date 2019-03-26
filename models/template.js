var mongoose = require('./../db');

var Schema = new mongoose.Schema({
    _id: {type: String, default: ''},
    preface_text: {type: String, default: ''},
    preface_strongText: {type: String, default: ''},
    preface_fontSize: {type: Number, default: 0},
    preface_lineHeight: {type: Number, default: 0},
    preface_letterSpace: {type: Number, default: 0},
    preface_topMargin: {type: Number, default: 0},
    preface_leftMargin: {type: Number, default: 0},
    preface_rightMargin: {type: Number, default: 0},

    title_text: {type: String, default: ''},
    title_fontSize: {type: Number, default: 0},
    title_letterSpace: {type: Number, default: 0},
    title_topMargin:  {type: Number, default: 0},

    inscription_text: {type: String, default: ''},
    inscription_fontSize: {type: Number, default: 0},
    inscription_lineHeight: {type: Number, default: 0},
    inscription_letterSpace: {type: Number, default: 0},
    inscription_width: {type: Number, default: 0},

    codeDate_fontSize: {type: Number, default: 0},
    codeDate_lineHeight: {type: Number, default: 0},
    codeDate_letterSpace: {type: Number, default: 0},
    codeDate_topMargin: {type: Number, default: 0},
    codeDate_rightMargin: {type: Number, default: 0},
    
    info_fontSize: {type: Number, default: 0},
    info_lineHeight: {type: Number, default: 0},
    info_letterSpace: {type: Number, default: 0},
    info_topMargin: {type: Number, default: 0},
    info_leftMargin: {type: Number, default: 0},

    qrcode_size: {type: Number, default: 0},
    qrcode_topMargin: {type: Number, default: 0},
    qrcode_leftMargin: {type: Number, default: 0},

    instruction_text: {type: String, default: ''},
    instruction_fontSize: {type: Number, default: 0},
    instruction_lineHeight: {type: Number, default: 0},
    instruction_letterSpace: {type: Number, default: 0},
    inscription_topMargin: {type: Number, default: 0},
    inscription_rightMargin: {type: Number, default: 0},

    instruction_text: {type: String, default: ''},
    instruction_fontSize: {type: Number, default: 0},
    instruction_lineHeight: {type: Number, default: 0},
    instruction_letterSpace: {type: Number, default: 0},
    instruction_topMargin: {type: Number, default: 0},
    instruction_leftMargin: {type: Number, default: 0},

    background: {type: String, default: ''},

    seal: {type: String, default: ''},
    seal_size: {type: Number, default: 0},
    seal_topMargin: {type: Number, default: 0},
    seal_rightMargin: {type: Number, default: 0},

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

var Model = mongoose.model('template', Schema, 'template');
module.exports = Model;