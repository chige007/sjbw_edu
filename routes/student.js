var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var multer  = require('multer');
const Sender = require('./../modules/sender');
const Student = require('./../models/student');

var upload = multer({ dest: path.join(__dirname, '../public/userUploaded/portraits')});

// 学籍信息录入页
router.get('/', (req, res, next) => {
    res.render('student/student_add', {title: '学籍信息录入'});
});
// 学籍信息录入成功页
router.get('/add/success', (req, res, next) => {
    res.render('student/student_add_success', {title: '系统提示'});
});
// 学籍信息保存
router.post('/add', upload.single('portrait'), (req, res, next) => {
    var formData = req.body;
    var studentData = new Student({
        name: formData.name,
        sex: formData.sex,
        nation: formData.nation,
        birthday: formData.birthday,
        id_card: formData.id_card,
        graduate_institutions: formData.graduate_institutions,
        education_type: formData.education_type,
        major: formData.major,
        edu_level: formData.edu_level,
        edu_type: formData.edu_type,
        admission_date: formData.admission_date,
        graduation_date: formData.graduation_date,
        edu_year: formData.edu_year,
        certificate_num: formData.certificate_num,
        edu_conclusion: formData.edu_conclusion,
        check_website: formData.check_website
    });
    studentData.save((err, result) => {
        if(err) {
            console.log(err);
        } else {
            console.log('新增学籍成功');
            var portrait = req.file;
            var tempPath = portrait.path;
            var ext = '.' + portrait.originalname.split('.')[1];
            var newFullFileName = 'portrait_' + result._id + ext;
            var newFilePath = './public/userUploaded/portraits/' + newFullFileName;
            fs.rename(tempPath, newFilePath, (err,data) => {
                if (err) throw err;
                console.log('头像改名成功');
                Student.updateOne({'_id': result._id}, {'portrait_url' : '/userUploaded/portraits/' + newFullFileName}, (err, result) => {
                    if (err) throw err;
                    console.log('修改头像路径成功');
                    res.redirect("/student/add/success");
                })
            });
        }
    });
});
// 获取单个学籍信息
router.get('/get', (req, res, next) => {

});
// 更新单个学籍信息
router.get('/update', (req, res, next) => {

});
// 删除单个学籍信息
router.get('/delete', (req, res, next) => {

});

// 学籍管理页
router.get('/list', (req, res, next) => {
    res.render('student/student_list', {title: '学籍管理'});
});
// 学籍列表
router.get('/list/get', (req, res, next) => {

});
module.exports = router;
