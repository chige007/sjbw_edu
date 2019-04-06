var express = require('express');
var router = express.Router();
var path = require('path');
var multer  = require('multer');
const Template = require('./../models/template');
const Curd = require('./../modules/curd');

var upload = multer({ dest: path.join(__dirname, '../public/userUploaded/templates')});

router.get('/template', (req, res, next) => {
    console.log("report/template");
    Curd.findOne(Template, req.query, (doc)=> {
        doc = doc || {};
        res.render('report/template', {
            title: '打印模板',
            templateConfig: doc
        });
    });
});

router.get('/template/:_id', (req, res, next) => {
    console.log("report/template/:_id");
    Curd.findOne(Template, req.params, (doc)=> {
        doc = doc || {};
        res.render('student/report', {
            studentInfo: {
                name: 'XXX',
                sex: 'X',
                birthday: 'XXXX-XX-XX',
                education_type: 'XXXXX',
                graduate_institutions_name: 'XXXXXXXXXX',
                major: 'XXXXXXXX',
                graduation_date: 'XXXX-XX-XX',
                edu_conclusion: 'XX',
                certificate_num: 'XXXXXXXXX',
                report_code: 'XXXXXXXX',
                printDate: 'XXXX-XX-XX',
                checkWebsite: 'http://XXX.XXXXXXXXXX.com/XXX/XXX'
            },
            templateConfig: doc
        });
    });
});

router.post('/template/save', (req, res, next) => {
    console.log("report/template/save");
    req.body._id = 'report_template';
    Curd.save(Template, req.body, (doc)=> {
        res.send('<script>window.top.document.getElementById("iframe_template").contentWindow.location.reload(true);</script>');
    })
});

router.post('/template/update',upload.fields([
    { name: 'background', maxCount: 1 },
    { name: 'seal', maxCount: 1 }
  ]), (req, res, next) => {
    console.log("report/template/update");
    var newData = {};
    for(var x in req.body){
        if(x != 'background' && x != 'seal')
            newData[x] = req.body[x];
    }
    if(req.files.background || req.files.seal){
        Curd.findOne(Template, {
            _id: req.body._id
        }, (doc)=> {
            if(req.files.background){
                var oldFilePath = path.join(__dirname, '../public' + doc.background);
                Curd.removeFile(oldFilePath);
                Curd.renameFile(req.files.background[0], './public/userUploaded/templates/', 'background', (filePath, fileName)=> {
                    Curd.update(Template, {
                        _id: doc._id
                    }, {
                        'background' : '/userUploaded/templates/' + fileName
                    });
                });
            }
            if(req.files.seal){
                var oldFilePath = path.join(__dirname, '../public' + doc.seal);
                Curd.removeFile(oldFilePath);
                Curd.renameFile(req.files.seal[0], './public/userUploaded/templates/', 'seal', (filePath, fileName)=> {
                    Curd.update(Template, {
                        _id: doc._id
                    }, {
                        'seal' : '/userUploaded/templates/' + fileName
                    });
                });
            }
        });
    }
    Curd.update(Template, {
        _id: req.body._id
    }, newData, (doc)=> {
        res.send('<script>window.top.document.getElementById("iframe_template").contentWindow.location.reload(true);</script>');
    })
});


module.exports = router;
