var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var multer  = require('multer');
var qr = require('qr-image')
const Sender = require('./../modules/sender');
const Student = require('./../models/student');
const Template = require('./../models/template');

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
    console.log('/student/add/success');
    console.log(req.body);
    res.render('student/student_add_success', {title: '系统提示'});
});
// 学籍信息保存
router.post('/add', upload.single('portrait'), (req, res, next) => {
    console.log('/student/add');
    console.log(req.body);
    var data = req.body;
    var studentData = new Student(data);
    studentData.save((err, result) => {
        if(err) {
            res.send(err)
        } else {
            console.log('新增学籍成功');
            var portrait = req.file;
            if(portrait){
                var tempPath = portrait.path;
                var ext = '.' + portrait.originalname.split('.')[1];
                var newFullFileName = 'portrait_' + result._id + ext;
                var newFilePath = './public/userUploaded/portraits/' + newFullFileName;
                fs.rename(tempPath, newFilePath, (err,data) => {
                    if (err) throw err;
                    console.log('头像改名成功');
                    Student.updateOne({'_id': result._id}, {
                        'portrait_url' : '/userUploaded/portraits/' + newFullFileName
                    }, (err, result) => {
                        if (err) throw err;
                        console.log('修改头像路径成功');
                        res.send('<script>window.top.$("#contentWrap").load("/student/add/success");</script>');
                    })
                });
            }else{
                res.send('<script>window.top.$("#contentWrap").load("/student/add/success");</script>');
            }
        }
    });
});
// 获取单个学籍信息
router.post('/get', (req, res, next) => {
    console.log('/student/get');
    console.log(req.body);
    var condition = req.body;
    var hasBack = req.body.hasBack;
    delete condition['hasBack'];
    Student.findOne(condition, (err, result) => {
        if(err){
            res.send(err)
        }else{
            if(result){
                result._idMask = new Buffer(result._id + '').toString('base64');
                res.render('student/student_check', {
                    title: '学籍信息查询',
                    studentInfo: result,
                    hasBack: hasBack
                });
            }else{
                res.render('student/student_search_none', {title: '学籍信息查询'});
            }
        }
    });
});
// 更新单个学籍信息
router.post('/update', upload.single('portrait'), (req, res, next) => {
    console.log('/student/update');
    console.log(req.body);
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
    console.log('/student/delete');
    console.log(req.body);
    Student.remove(req.body, (err, result) => {
        if(err){
            res.send(err)
        }else{
            var full_portrait_path = path.join(__dirname, '../public' + req.body.portrait_url);
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
    console.log('/student/list');
    console.log(req.body);
    res.render('student/student_list', {title: '学籍管理'});
});
// 学籍列表
router.post('/list/get', (req, res, next) => {
    console.log('/student/list/get');
    console.log(req.body);
    var offset = parseInt(req.body.offset);
    var pageSize = parseInt(req.body.limit);
    var order = req.body.order;
    var sort = {};
    var condition = {};
    var $and = [];
    for(var x in req.body){
        if(x != 'offset' && x != 'limit' && x != 'order' && x != 'sort' && req.body[x]){
            let param = {};
            param[x] = new RegExp(req.body[x], 'i');
            $and.push(param);
        }
    }
    if($and.length){
        condition['$and'] = $and;
    }
    if(order == 'asc')
        sort[req.body.sort] = 1;
    else
        sort[req.body.sort] = -1;
    console.log(condition);
    var query = Student.find(condition);
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
// 学籍信息查询页
router.get('/search', (req, res, next) => {
    console.log('/student/search');
    console.log(req.query);
    res.render('student/student_search', {
        title: '学籍信息查询',
        bgcolor: '#' + req.query.bgcolor
    });
});


var getStudentInfo = function(condition, res, encode){
    if(encode)
        condition._id = new Buffer(condition._id + '', 'base64').toString();
    console.log('func: getStudentInfo');
    console.log(condition);
    Template.findOne({
        _id: 'report_template'
    }, (err, result) => {
        if(err){
            throw err;
        }else{
            var templateConfig = {};
            if(result){
                templateConfig = result;
            } 
            Student.findOne(condition, (err, result) => {
                if(err){
                    res.send(err)
                }else if(result){
                    // var _idMask = new Buffer(result._id + '').toString('base64');
                    var sendData = result
                    var d = new Date();
                    var date = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate();
                    sendData.printDate = date;
                    var searchWebsite = 'http://www.chsecon.com';
                    sendData.searchWebsite = searchWebsite;
                    sendData.checkWebsite = checkWebsite;
                    var checkWebsite = 'http://search.chsecon.com/student/report/' + result.report_code;
                    sendData.checkWebsite = checkWebsite;
        
                    res.render('student/student_report', {
                        studentInfo: sendData,
                        templateConfig: templateConfig
                    });
                }
            });
        }
    });
}
router.post('/print', (req, res, next) => {
    console.log('/student/print');
    console.log(req.body);
    getStudentInfo(req.body, res, false);
});

router.get('/co/:_id', (req, res, next) => {
    console.log('/student/co');
    console.log(req.params);
    getStudentInfo(req.params, res, true);
});

router.get('/report/:report_code', (req, res, next) => {
    console.log('/student/report');
    console.log(req.params);
    getStudentInfo(req.params, res);
});

router.get('/getQrcode/:_id', (req, res, next) => {
    console.log('/student/getQrcode');
    console.log(req.params);
    var _idMask = new Buffer(req.params._id + '').toString('base64');
    var text = 'http://search.chsecon.com/student/co/' + _idMask;
    try {
        var img = qr.image(text, {
            type: 'png',
            margin: 1,
            size: 6
        });
        res.writeHead(200, {'Content-Type': 'image/png'});
        img.pipe(res);
    } catch (e) {
        res.writeHead(414, {'Content-Type': 'text/html'});
        res.end('<h1>414 Request-URI Too Large</h1>');
    }
});

module.exports = router;
