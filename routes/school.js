var express = require('express');
var router = express.Router();
const Sender = require('./../modules/sender');
const School = require('./../models/school');

router.get('/list', function(req, res, next) {
    res.render('school/school_list');
});

router.post('/list/get', function(req, res, next) {
    console.log(req.body);
    res.send({
        total: 10,
        rows: [{
            id: 1,
            code: '123',
            name: 'asdf'
        }]
    });
});

router.post('/checkCode', function(req, res, next) {
    var code = req.body.code
    School.countDocuments({
        code: code
    }, (err, count) => {
        if(err){
            console.log(err)
        }else{
            console.log(count);
            if(!count){
                var sender = new Sender().getData();
                res.send(sender);
            }else{
                var sender = new Sender({
                    code: 1,
                    msg: code + '已存在'
                }).getData();
                res.send(sender);
            }
        }
    });
});

router.post('/add', function(req, res, next) {
    var formData = req.body;
    console.log(formData);
    var schoolData = new School({
        code: formData.code,
        name: formData.name
    });
    schoolData.save((err, result) => {
        if(err) {
            console.log(err);
            var sender = new Sender({
                code: 1,
                msg: err
            }).getData();
        } else {
            var sender = new Sender({
                msg: '保存成功'
            }).getData();
        }
        res.send(sender);
    });
});

router.post('/get', function(req, res, next) {

});

router.post('/update', function(req, res, next) {

});

module.exports = router;
