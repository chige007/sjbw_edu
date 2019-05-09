var mongoose = require('./../db');
const Counters = require('./../models/counters');

var Schema = new mongoose.Schema({
    // 报告编号
    report_code: {type: Number, default: 0},
    // 学校编号
    school_code: {type: String},
    // 所属网站
    website_belong: {type: String},
    // 姓名
    name: {type: String},
    // 性别
    sex: {type: String},
    // 民族
    nation: {type: String},
    // 出生日期
    birthday: {type: String},
    // 身份证号码
    id_card: {type: String},
    // 毕业院校
    graduate_institutions: {type: String},
    // 毕业院校代码
    graduate_institutions_name: {type: String},
    // 学历类型
    education_type: {type: String},
    // 专业
    major: {type: String},
    // 学历层次
    edu_level: {type: String},
    // 学习形式
    edu_type: {type: String},
    // 入学时间
    admission_date: {type: String},
    // 毕业时间
    graduation_date: {type: String},
    // 学制
    edu_year: {type: String},
    // 证书编号
    certificate_num: {type: String},
    // 毕结业结论
    edu_conclusion: {type: String},
    // 证书查询网址
    check_website: {type: String},
    // 头像地址
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

// 保存前设置报告编号
Schema.pre('save', function(next){
    console.log('preSave');
    var doc = this;
    Counters.findOneAndUpdate({
        _id: 'report_code'
    }, {
        $inc: { seq: 1 }
    }, {
        new: true,
        upsert: true
    }, function(err, counter){
        if(err)
            return next(err);
        doc.report_code = counter.seq;
        next();
    })
});

var Model = mongoose.model('student', Schema, 'student');
module.exports = Model;