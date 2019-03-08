var express = require('express');
var router = express.Router();
const Sender = require('./../modules/sender');
const Student = require('./../models/student');

// 信息录入页
router.get('/enter', function(req, res, next) {
    res.render('stu_info_service/stu_info_enter', {title: '信息录入'});
});

router.post('/save', function(req, res, next) {
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
    studentData.save(function(err, result){
        if(err) {
            console.log(err);
        } else {
            console.log(result);
            console.log(result._id);
        }
    })
});

module.exports = router;
