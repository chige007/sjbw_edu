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
    res.render('student/student_add', {
        title: '学籍信息录入',
        studentInfo: {}
    });
});
router.post('/', (req, res, next) => {
    Student.findOne(req.body, (err, result) => {
        if(err){
            res.send(err)
        }else{
            res.render('student/student_add', {
                title: '学籍信息查询',
                studentInfo: result
            });
        }
    });
});
// 学籍信息录入成功页
router.get('/add/success', (req, res, next) => {
    res.render('student/student_add_success', {title: '系统提示'});
});
// 学籍信息保存
router.post('/add', upload.single('portrait'), (req, res, next) => {
    var studentData = new Student(req.body);
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
                    res.send('<script>window.top.$("#contentWrap").load("/student/add/success");</script>');
                })
            });
        }
    });
});
// 获取单个学籍信息
router.post('/get', (req, res, next) => {
    console.log(req.body);
    Student.findOne(req.body, (err, result) => {
        if(err){
            res.send(err)
        }else{
            console.log(result);
            if(result){
                res.render('student/student_check', {
                    title: '学籍信息查询',
                    studentInfo: result
                });
            }else{
                res.render('student/student_search_none', {title: '学籍信息查询'});
            }
        }
    });
});
// 更新单个学籍信息
router.post('/update', upload.single('portrait'), (req, res, next) => {
    var condition = {
        _id: req.body._id
    }
    var newData = {};
    for(var x in req.body){
        if(x != '_id' && x != 'portrait_url')
            newData[x] = req.body[x];
    }
    if(req.file){
        Student.findOne(condition, (err, result) => {
            if(err){
                res.send(err)
            }else{
                var oldFilePath = path.join(__dirname, '../public' + result.portrait_url);
                console.log(oldFilePath);
                fs.unlink(oldFilePath, (err) => {
                    if(err){
                        res.send(err);
                    }else{
                        var portrait = req.file;
                        var tempPath = portrait.path;
                        var ext = '.' + portrait.originalname.split('.')[1];
                        var newFullFileName = 'portrait_' + req.body._id + ext;
                        var newFilePath = './public/userUploaded/portraits/' + newFullFileName;
                        fs.rename(tempPath, newFilePath, (err,data) => {
                            if (err) throw err;
                            console.log('头像改名成功');
                            Student.updateOne({'_id': req.body._id}, {'portrait_url' : '/userUploaded/portraits/' + newFullFileName}, (err, result) => {
                                if (err) throw err;
                                console.log('修改头像路径成功');
                            })
                        });
                    }
                });
            }
        });
    }
    Student.update(condition, {$set: newData}, (err, result) => {
        if(err){
            res.send(err)
        }else{
            res.send('<script>window.top.$.tipsShow({code: 0, msg: "修改成功"});window.top.$("#modal_student_update").modal("hide");window.top.$("#studentList").bootstrapTable("refresh");</script>');
        }
    });
});
// 删除单个学籍信息
router.post('/delete', (req, res, next) => {
    console.log(req.body);
    Student.remove(req.body, (err, result) => {
        console.log(result);
        if(err){
            res.send(err)
        }else{
            var full_portrait_path = path.join(__dirname, '../public' + req.body.portrait_url);
            console.log(full_portrait_path);
            fs.unlink(full_portrait_path, (err) => {
                if(err){
                    res.send(err)
                }else{
                    var sender = new Sender({
                        msg: '删除成功'
                    }).getData();
                    res.send(sender);
                }
            });
        }
    });
});

// 学籍管理页
router.get('/list', (req, res, next) => {
    res.render('student/student_list', {title: '学籍管理'});
});
// 学籍列表
router.post('/list/get', (req, res, next) => {
    console.log(req.body);
    var offset = parseInt(req.body.offset);
    var pageSize = parseInt(req.body.limit);
    var order = req.body.order;
    var sort = {};
    if(order == 'asc')
        sort[req.body.sort] = 1;
    else
        sort[req.body.sort] = -1;
    var query = Student.find({});
    query.skip(offset).limit(pageSize).sort(sort).exec((err, rs) => {
        if(err){
            res.send(err);
        }else{
            Student.find((err,result) => {
                res.send({
                    total: result.length,
                    rows: rs
                });
            });
        }
    });
});

router.get('/search', (req, res, next) => {
    res.render('student/student_search', {title: '学籍信息查询'});
});

module.exports = router;
