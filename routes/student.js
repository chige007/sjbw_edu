var express = require('express');
var router = express.Router();
const Sender = require('./../modules/sender');
const Student = require('./../models/student');

// 信息录入页
router.get('/enter', function(req, res, next) {
    res.render('stu_info_service/stu_info_enter', {title: '信息录入'});
});

router.post('/save', function(req, res, next) {
    Student.create(req.body, function(err, result){
        if(err) {
            console.log(err);
        } else {
            console.log(result);
        }
    })
});

module.exports = router;
