var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var multer  = require('multer');
const Template = require('./../models/template');

var upload = multer({ dest: path.join(__dirname, '../public/userUploaded/templates')});

router.get('/template', (req, res, next) => {
    console.log("report/template");
    console.log(req.query);
    var condition = req.query;
    Template.findOne(condition, (err, result) => {
        if(err){
            throw err;
        }else{
            var templateConfig = {};
            if(result){
                templateConfig = result;
            } 
            res.render('report/template', {
                title: '打印模板',
                templateConfig: templateConfig
            });
        }
    });
});

router.get('/template/:_id', (req, res, next) => {
    console.log("report/template/:_id");
    var condition = {
        _id: req.params._id
    }
    Template.findOne(condition, (err, result) => {
        if(err){
            throw err;
        }else{
            var templateConfig = {};
            if(result){
                templateConfig = result;
            } 
            res.render('student/student_report', {
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
                templateConfig: templateConfig
            });
        }
    });
});

router.post('/template/save', (req, res, next) => {
    console.log("report/template/save");
    console.log(req.body);
    var sendData = {
        _id: 'report_template'
    }
    for(var x in req.body){
        if(req.body[x]){
            sendData[x] = req.body[x];
        }
    }
    var templateData = new Template(sendData);
    templateData.save((err, result) => {
        if(err) {
            throw err;
        } else {
            res.send('<script>window.top.document.getElementById("iframe_template").contentWindow.location.reload(true);</script>');
        }
    });
});

function renameFile(file, name, templateName, field){
    console.log(file);
    var tempPath = file.path;
    var ext = '.' + file.originalname.split('.')[1];
    var newFullFileName = name + ext;
    var newFilePath = './public/userUploaded/templates/' + newFullFileName;
    fs.rename(tempPath, newFilePath, (err,data) => {
        if (err) throw err;
        console.log('图片改名成功');
        var setter = {};
        setter[field] = '/userUploaded/templates/' + newFullFileName;
        Template.updateOne({
            _id: templateName
        }, setter, (err, result) => {
            if (err) throw err;
            console.log('修改成功');
        })
    });
}

router.post('/template/update',upload.fields([
    { name: 'background', maxCount: 1 },
    { name: 'seal', maxCount: 1 }
  ]), (req, res, next) => {
    console.log("report/template/update");
    var templateName = req.body._id;
    var condition = {
        _id: templateName
    }
    if(req.files.background || req.files.seal){
        Template.findOne(condition, (err, result) => {
            if(err){
                throw err;
            }else{
                if(req.files.background){
                    var oldFilePath_b = path.join(__dirname, '../public' + result.background);
                    if(result.background && fs.existsSync(oldFilePath_b)){
                        fs.unlink(oldFilePath_b, (err) => {
                            if(err){
                                throw err;
                            }else{
                                renameFile(req.files.background[0], 'background', templateName, 'background');
                            }
                        });
                    }else{
                        renameFile(req.files.background[0], 'background', templateName, 'background');
                    }
                }
                if(req.files.seal){
                    var oldFilePath_s = path.join(__dirname, '../public' + result.seal);
                    if(result.seal && fs.existsSync(oldFilePath_s)){
                        fs.unlink(oldFilePath_s, (err) => {
                            if(err){
                                throw err;
                            }else{
                                renameFile(req.files.seal[0], 'seal', templateName, 'seal');
                            }
                        });
                    }else{
                        renameFile(req.files.seal[0], 'seal', templateName, 'seal');
                    }
                }
            }
        });
    }
    var sendData = {};
    for(var x in req.body){
        if(x != 'background' && x != 'seal'){
            sendData[x] = req.body[x] || '';
        }
    }
    Template.update(condition, {$set: sendData}, (err, result) => {
        if(err){
            throw err;
        }else{
            res.send('<script>window.top.document.getElementById("iframe_template").contentWindow.location.reload(true);</script>');
        }
    });
});


module.exports = router;
