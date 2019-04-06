var express = require('express');
var router = express.Router();
const Sender = require('./../modules/sender');
const Curd = require('./../modules/curd');
const School = require('./../models/school');

router.get('/list', (req, res, next) => {
    console.log('/school/list');
    res.render('school/school_list');
});

router.post('/list/get', (req, res, next) => {
    console.log('/school/list/get');
    Curd.getList(School, req.body, {
        offset: parseInt(req.body.offset),
        pageSize: parseInt(req.body.limit),
        sort: req.body.sort,
        order: req.body.order
    }, (doc, count) => {
        res.send({
            total: count,
            rows: doc
        });
    });
});

router.post('/checkCode', (req, res, next) => {
    console.log('/school/checkCode');
    var code = req.body.code;
    Curd.count(School, {
        code: code
    }, (count) => {
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
    });
});

router.post('/add', (req, res, next) => {
    console.log('/school/add');
    Curd.save(School, {
        code: req.body.code,
        name: req.body.name
    }, (doc) => {
        var sender = new Sender({
            msg: '保存成功'
        }).getData();
        res.send(sender);
    });
});

router.post('/update', (req, res, next) => {
    console.log('/school/update');
    Curd.update(School, {
        _id: req.body._id
    }, req.body, (doc)=> {
        var sender = new Sender({
            msg: '修改成功'
        }).getData();
        res.send(sender);
    });
});

router.post('/delete', (req, res, next) => {
    console.log('/school/delete');
    Curd.remove(School, req.body, (doc)=> {
        var sender = new Sender({
            msg: '删除成功'
        }).getData();
        res.send(sender);
    });
});

module.exports = router;
