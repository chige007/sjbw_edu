var express = require('express');
var router = express.Router();
const Sender = require('./../modules/sender');
const School = require('./../models/school');

router.get('/list', (req, res, next) => {
    res.render('school/school_list');
});

router.post('/list/get', (req, res, next) => {
    console.log(req.body);
    var offset = parseInt(req.body.offset);
    var pageSize = parseInt(req.body.limit);
    var sort = req.body.sort;
    var query = School.find({});
    query.skip(offset).limit(pageSize).sort(sort).exec((err, rs) => {
        if(err){
            res.send(err);
        }else{
            School.find((err,result) => {
                res.send({
                    total: result.length,
                    rows: rs
                });
            });
        }
    });
});

router.post('/checkCode', (req, res, next) => {
    var code = req.body.code
    School.countDocuments({
        code: code
    }, (err, count) => {
        if(err){
            console.log(err)
        }else{
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

router.post('/add', (req, res, next) => {
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

router.post('/get', (req, res, next) => {

});

router.post('/update', (req, res, next) => {

});

module.exports = router;
