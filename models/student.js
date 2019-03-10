var mongoose = require('./../db');

var Schema = new mongoose.Schema({
    school_code: {type: String},
    name: {type: String},
    sex: {type: String},
    nation: {type: String},
    birthday: {type: String},
    id_card: {type: String},
    graduate_institutions: {type: String},
    graduate_institutions_name: {type: String},
    education_type: {type: String},
    major: {type: String},
    edu_level: {type: String},
    edu_type: {type: String},
    admission_date: {type: String},
    graduation_date: {type: String},
    edu_year: {type: String},
    certificate_num: {type: String},
    edu_conclusion: {type: String},
    check_website: {type: String},
    portrait_url: {type: String},
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

var Model = mongoose.model('student', Schema, 'student');
module.exports = Model;