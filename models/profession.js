var mongoose = require('./../db');

var Schema = new mongoose.Schema({
    // 姓名
    name: {type: String},
    // 性别
    sex: {type: String},
    // 民族
    nation: {type: String},
    // 籍贯
    province: {type: String},
    city: {type: String},
    // 出生日期
    birthday: {type: String},
    // 专业名称
    major: {type: String},
    // 证书编号
    certificate_num: {type: String},
    // 资格级别
    qualification_level: {type: String},
    // 发证时间
    certification_date: {type: String},
    // 证件号码
    id_card: {type: String},
    // 单位名称
    company_name: {type: String},
    // 理论知识考试成绩
    theory_score: {type: String},
    // 实践技能考试成绩
    practice_score: {type: String},
    // 综合评审成绩
    comprehensive_score: {type: String},
    // 评定成绩
    evaluate_score: {type: String},
    // 头像
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

var Model = mongoose.model('profession', Schema, 'profession');
module.exports = Model;