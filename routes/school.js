var express = require('express');
var router = express.Router();
const Sender = require('./../modules/sender');
const School = require('./../models/school');

router.get('/list', (req, res, next) => {
    console.log('/school/list');
    res.render('school/school_list');
});

router.post('/list/get', (req, res, next) => {
    console.log('/school/list/get');
    console.log(req.body);
    var offset = parseInt(req.body.offset);
    var pageSize = parseInt(req.body.limit);
    var order = req.body.order;
    var sort = {};
    if(order == 'asc')
        sort[req.body.sort] = 1;
    else
        sort[req.body.sort] = -1;
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
    console.log('/school/checkCode');
    console.log(req.body);
    var code = req.body.code
    School.countDocuments({
        code: code
    }, (err, count) => {
        if(err){
            res.send(err);
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
    console.log('/school/add');
    console.log(req.body);
    var formData = req.body;
    var schoolData = new School({
        code: formData.code,
        name: formData.name
    });
    schoolData.save((err, result) => {
        if(err){
            res.send(err);
        }else{
            var sender = new Sender({
                msg: '保存成功'
            }).getData();
        }
        res.send(sender);
    });
});

router.post('/get', (req, res, next) => {
    console.log('/school/get');
    console.log(req.body);
    School.find(req.body, (err, result) => {
        if(err){
            res.send(err)
        }else{
            var sender = new Sender({
                data: result
            }).getData();
            res.send(sender);
        }
    });
});

router.post('/update', (req, res, next) => {
    console.log('/school/update');
    console.log(req.body);
    var condition = {
        _id: req.body._id
    }
    School.update(condition, {$set: req.body}, (err, result) => {
        if(err){
            res.send(err)
        }else{
            var sender = new Sender({
                msg: '修改成功'
            }).getData();
            res.send(sender);
        }
    });
});

router.post('/delete', (req, res, next) => {
    console.log('/school/delete');
    console.log(req.body);
    School.remove(req.body, (err, result) => {
        if(err){
            res.send(err)
        }else{
            var sender = new Sender({
                msg: '删除成功'
            }).getData();
            res.send(sender);
        }
    });
});

module.exports = router;
