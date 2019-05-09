var express = require('express');
var router = express.Router();
var path = require('path');
var multer  = require('multer');
var qr = require('qr-image')
const Sender = require('./../modules/sender');
const Curd = require('./../modules/curd');
const Student = require('./../models/student');
const Template = require('./../models/template');
const systemConfig = require('./../modules/system');

var upload = multer({ dest: path.join(__dirname, '../public/userUploaded/portraits')});

// 学籍信息录入页
router.get('/', (req, res, next) => {
    console.log('get:/student');
    res.render('student/add', {
        title: '学籍信息录入',
        studentInfo: {}
    });
});
router.post('/', (req, res, next) => {
    console.log('post:/student');
    Curd.findOne(Student, req.body, (doc) => {
        res.render('student/add', {
            title: '学籍信息查询',
            studentInfo: doc
        });
    });
});
// 学籍信息保存
router.post('/add', upload.single('portrait'), (req, res, next) => {
    console.log('/student/add');
    var successScript = '<script>window.top.$("#contentWrap").load("/add/success?addUrl=/?tab=/student&listUrl=/?tab=/student/list");</script>';
    Curd.save(Student, req.body, (doc)=> {
        var portrait = req.file;
        if(portrait){
            Curd.renameFile(portrait, './public/userUploaded/portraits/', 'portrait_' + doc._id, (filePath, fileName)=> {
                Curd.update(Student, {
                    _id: doc._id
                }, {
                    'portrait_url' : '/userUploaded/portraits/' + fileName
                }, (doc2)=> {
                    res.send(successScript);
                });
            })
        }else{
            res.send(successScript);
        }
    });
});
// 获取单个学籍信息
router.post('/get', (req, res, next) => {
    console.log('/student/get');
    console.log(req.body);
    Curd.findOne(Student, req.body, (doc) => {
        if(doc){
            doc._idMask = new Buffer(doc._id + '').toString('base64');
            systemConfig.get((sysConfig)=>{
                res.render('student/check', {
                    title: '学籍信息查询',
                    studentInfo: doc,
                    hasBack: req.query.hasBack,
                    bgcolor: req.query.bgcolor,
                    school_code: req.body.graduate_institutions,
                    website_belong: req.body.website_belong,
                    sysConfig
                });
            });
        }else{
            var query_bgcolor = req.query.bgcolor ? 'bgcolor='+req.query.bgcolor : ''
            var query_graduate_institutions = req.body.graduate_institutions ? 'school_code='+req.body.graduate_institutions : ''
            var query_website_belong = req.body.website_belong ? 'website_belong='+ req.body.website_belong : ''
            res.render('common/search_none', {
                bgcolor: req.query.bgcolor,
                tips: '没有该学生的学籍信息！',
                backUrl: '/student/search?'+ query_bgcolor + '&' + query_graduate_institutions + '&' + query_website_belong
            });
        }
    });
});

// 更新单个学籍信息
router.post('/update', upload.single('portrait'), (req, res, next) => {
    console.log('/student/update');
    var newData = {};
    for(var x in req.body){
        if(x != '_id' && x != 'portrait_url')
            newData[x] = req.body[x];
    }
    if(req.file){
        Curd.findOne(Student, {
            _id: req.body._id
        }, (doc)=> {
                var oldFilePath = path.join(__dirname, '../public' + doc.portrait_url);
                Curd.removeFile(oldFilePath);
                Curd.renameFile(req.file, './public/userUploaded/portraits/', 'portrait_' + doc._id, (filePath, fileName)=> {
                    Curd.update(Student, {
                        _id: doc._id
                    }, {
                        'portrait_url' : '/userUploaded/portraits/' + fileName
                    });
                });
        });
    }
    Curd.update(Student, {
        _id: req.body._id
    }, newData, (doc)=> {
        res.send('<script>window.top.$.tipsShow({code: 0, msg: "修改成功"});window.top.$("#modal_student_update").modal("hide");window.top.$("#studentList").bootstrapTable("refresh");</script>');
    });
});
// 删除单个学籍信息
router.post('/delete', (req, res, next) => {
    console.log('/student/delete');
    Curd.remove(Student, {
        _id: req.body._id
    }, (doc)=> {
        var portrait_path = path.join(__dirname, '../public' + req.body.portrait_url);
        Curd.removeFile(portrait_path, (doc)=> {
            var sender = new Sender({
                msg: '删除成功'
            }).getData();
            res.send(sender);
        });
    })
});

// 学籍管理页
router.get('/list', (req, res, next) => {
    console.log('/student/list');
    res.render('student/list', {title: '学籍管理'});
});
// 学籍列表
router.post('/list/get', (req, res, next) => {
    console.log('/student/list/get');
    Curd.getList(Student, req.body, {
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
// 学籍信息查询页
router.get('/search', (req, res, next) => {
    console.log('/student/search');
    console.log(req.query);
    var bgcolor = req.query.bgcolor;
    if(bgcolor && bgcolor.indexOf('#') == -1)bgcolor = '#'+bgcolor;
    systemConfig.get((sysConfig)=>{
        res.render('student/search', {
            title: '学籍信息查询',
            school_code: req.query.school_code,
            website_belong: req.query.website_belong,
            bgcolor: bgcolor,
            sysConfig
        });
    });
});

var getStudentInfo = function(condition, res, encode){
    console.log(condition);
    if(encode)
        condition._id = new Buffer(condition._id + '', 'base64').toString();
    console.log('func: getStudentInfo');
    Curd.findOne(Template, {
        _id: 'report_template'
    }, (doc)=> {
        doc = doc || {};
        Curd.findOne(Student, condition, (doc2)=> {
            var d = new Date();
            var date = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate();
            doc2.printDate = date;
            var searchWebsite = 'http://www.chsecon.com';
            doc2.searchWebsite = searchWebsite;
            var checkWebsite = 'http://search.chsecon.com/student/report/' + doc2.report_code;
            doc2.checkWebsite = checkWebsite;
            res.render('student/report', {
                studentInfo: doc2,
                templateConfig: doc
            });
        }); 
    });
}
router.post('/print', (req, res, next) => {
    console.log('/student/print');
    getStudentInfo(req.body, res, false);
});

router.get('/co/:_id', (req, res, next) => {
    console.log('/student/co');
    getStudentInfo(req.params, res, true);
});

router.get('/report/:report_code', (req, res, next) => {
    console.log('/student/report');
    getStudentInfo(req.params, res);
});

router.get('/getQrcode/:_id', (req, res, next) => {
    console.log('/student/getQrcode');
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
