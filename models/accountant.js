var mongoose = require('./../db');

var Schema = new mongoose.Schema({
    // 身份证
    id_card: {type: String},
    // 姓名
    name: {type: String},
    // 性别
    sex: {type: String},
    // 地区
    city: {type: String},
    area: {type: String},
    // 专业技术资格级别
    qualification_level: {type: String},
    // 专业技术资格取得方式
    qualification_getType: {type: String},
    // 专业技术资格取得时间
    qualification_getDate: {type: String},
    // 换证日期
    renewal_date: {type: String},
    // 从业资格证发证日期
    certification_date: {type: String},
    // 专业技术资格证书号或批文号
    qualification_number: {type: String},
    // 继续教育年度
    continuing_edu_year: {type: String},
    // 课程内容
    course_content: {type: String},
    // 培训学时
    training_hours: {type: String},
    // 培训单位
    training_unit: {type: String},
    // 培训日期
    training_date: {type: String},
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

var Model = mongoose.model('accountant', Schema, 'accountant');
module.exports = Model;