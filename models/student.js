var mongoose = require('./../db');
const Counters = require('./../models/counters');

var Schema = new mongoose.Schema({
    report_code: {type: Number, default: 0},
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

Schema.pre('save', (next) => {
    console.log('preSave');
    var doc = this;
    Counters.findByIdAndUpdate({
        _id: 'report_code'
    }, {
        $inc: { sequence_value: 1 }
    }, {
        new: true//,
        // upsert: true
    }, (err, counter) => {
        console.log(counter);
        if(err)
            return next(err);
        doc.report_code = counter.sequence_value;
        console.log(doc.report_code);
        next();
    })
});

var Model = mongoose.model('student', Schema, 'student');
module.exports = Model;