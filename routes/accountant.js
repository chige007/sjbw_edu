var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var multer  = require('multer');
var qr = require('qr-image')
const Sender = require('./../modules/sender');
const Accountant = require('./../models/accountant');
const China = require('./../modules/china');

var upload = multer({ dest: path.join(__dirname, '../public/userUploaded/portraits')});

var selectOptions = {
    continuing_edu_year: [],
    yunnan: China.find((e) => {
        return e['name'] == '云南省';
    })['city']
}
for(var y = new Date().getFullYear(); y + 20 > new Date().getFullYear(); y--){
    selectOptions.continuing_edu_year.push(y+'');
}

// 信息录入页
router.get('/add', (req, res, next) => {
    res.render('accountant/accountant_add', {
        title: '信息录入',
        accountantInfo: {},
        selectOptions: selectOptions
    });
});
router.post('/add', (req, res, next) => {
    Accountant.findOne(req.body, (err, result) => {
        if(err){
            res.send(err)
        }else{
            res.render('accountant/accountant_add', {
                title: '信息查询',
                accountantInfo: result,
                selectOptions: selectOptions
            });
        }
    });
});
// 学籍信息录入成功页
router.get('/add/success', (req, res, next) => {
    console.log('/accountant/add/success');
    console.log(req.body);
    res.render('accountant/accountant_add_success', {title: '系统提示'});
});
// 学籍信息保存
router.post('/save', upload.single('portrait'), (req, res, next) => {
    console.log('/accountant/add');
    console.log(req.body);
    var data = req.body;
    var accountantData = new Accountant(data);
    accountantData.save((err, result) => {
        if(err) {
            res.send(err)
        } else {
            console.log('新增学籍成功');
            var portrait = req.file;
            if(portrait){
                var tempPath = portrait.path;
                var ext = '.' + portrait.originalname.split('.')[1];
                var newFullFileName = 'portrait_acc_' + result._id + ext;
                var newFilePath = './public/userUploaded/portraits/' + newFullFileName;
                fs.rename(tempPath, newFilePath, (err,data) => {
                    if (err) throw err;
                    console.log('头像改名成功');
                    Accountant.updateOne({'_id': result._id}, {
                        'portrait_url' : '/userUploaded/portraits/' + newFullFileName
                    }, (err, result) => {
                        if (err) throw err;
                        console.log('修改头像路径成功');
                        res.send('<script>window.top.$("#contentWrap").load("/accountant/add/success");</script>');
                    })
                });
            }else{
                res.send('<script>window.top.$("#contentWrap").load("/accountant/add/success");</script>');
            }
        }
    });
});
// 获取单个学籍信息
router.post('/get', (req, res, next) => {
    console.log('/accountant/get');
    console.log(req.body);
    var condition = req.body;
    var hasBack = req.body.hasBack;
    delete condition['hasBack'];
    Accountant.findOne(condition, (err, result) => {
        if(err){
            res.send(err)
        }else{
            if(result){
                result._idMask = new Buffer(result._id + '').toString('base64');
                res.render('accountant/accountant_check', {
                    title: '信息查询',
                    accountantInfo: result,
                    hasBack: hasBack
                });
            }else{
                res.render('accountant/accountant_search_none');
            }
        }
    });
});

// 更新单个学籍信息
router.post('/update', upload.single('portrait'), (req, res, next) => {
    console.log('/accountant/update');
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
        Accountant.findOne(condition, (err, result) => {
            if(err){
                res.send(err)
            }else{
                var renameFile = function(portrait, _id){
                    var tempPath = portrait.path;
                    var ext = '.' + portrait.originalname.split('.')[1];
                    var newFullFileName = 'portrait_acc_' + _id + ext;
                    var newFilePath = './public/userUploaded/portraits/' + newFullFileName;
                    fs.rename(tempPath, newFilePath, (err,data) => {
                        if (err) throw err;
                        console.log('头像改名成功');
                        Accountant.updateOne({'_id': _id}, {'portrait_url' : '/userUploaded/portraits/' + newFullFileName}, (err, result) => {
                            if (err) throw err;
                            console.log('修改头像路径成功');
                        })
                    });
                }
                var oldFilePath = path.join(__dirname, '../public' + result.portrait_url);
                if(fs.existsSync(oldFilePath)){
                    fs.unlink(oldFilePath, (err) => {
                        if(err){
                            res.send(err);
                        }else{
                            renameFile(req.file, req.body._id);
                        }
                    });
                }else{
                    renameFile(req.file, req.body._id);
                }
            }
        });
    }
    Accountant.update(condition, {$set: newData}, (err, result) => {
        if(err){
            res.send(err)
        }else{
            res.send('<script>window.top.$.tipsShow({code: 0, msg: "修改成功"});window.top.$("#modal_accountant_update").modal("hide");window.top.$("#accountantList").bootstrapTable("refresh");</script>');
        }
    });
});
// 删除单个学籍信息
router.post('/delete', (req, res, next) => {
    console.log('/accountant/delete');
    console.log(req.body);
    Accountant.remove(req.body, (err, result) => {
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
    console.log('/accountant/list');
    console.log(req.body);
    res.render('accountant/accountant_list', {title: '学籍管理'});
});
// 学籍列表
router.post('/list/get', (req, res, next) => {
    console.log('/accountant/list/get');
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
    var query = Accountant.find(condition);
    query.skip(offset).limit(pageSize).sort(sort).exec((err, rs) => {
        if(err){
            res.send(err);
        }else{
            Accountant.find((err,result) => {
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
    console.log('/search');
    console.log(req.query);
    res.render('accountant/accountant_search', {
        title: '信息查询',
        bgcolor: '#' + req.query.bgcolor
    });
});

module.exports = router;
