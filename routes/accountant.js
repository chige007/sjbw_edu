var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var multer  = require('multer');
var qr = require('qr-image')
const Sender = require('./../modules/sender');
const Accountant = require('./../models/accountant');
const China = require('./../modules/china');
const Curd = require('./../modules/curd');

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
    Curd.findOne(Accountant, req.body, (doc)=> {
        res.render('accountant/accountant_add', {
            title: '信息查询',
            accountantInfo: doc,
            selectOptions: selectOptions
        });
    });
});
// 学籍信息录入成功页
router.get('/add/success', (req, res, next) => {
    console.log('/accountant/add/success');
    res.render('accountant/accountant_add_success', {title: '系统提示'});
});
// 学籍信息保存
router.post('/save', upload.single('portrait'), (req, res, next) => {
    console.log('/accountant/add');
    var successScript = '<script>window.top.$("#contentWrap").load("/add/success?addUrl=/acc?tab=/accountant/add&listUrl=/acc?tab=/accountant/list");</script>';
    Curd.save(Accountant, req.body, (doc)=> {
        var portrait = req.file;
        if(portrait){
            Curd.renameFile(portrait, './public/userUploaded/portraits/', 'portrait_acc_' + doc._id, (filePath, fileName)=> {
                Curd.update(Accountant, {
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
    console.log('/accountant/get');
    Curd.findOne(Accountant, req.body, (doc) => {
        if(doc){
            doc._idMask = new Buffer(doc._id + '').toString('base64');
            res.render('accountant/accountant_check', {
                title: '信息查询',
                accountantInfo: doc,
                hasBack: req.query.hasBack,
                bgcolor: req.query.bgcolor
            });
        }else{
            res.render('common/search_none', {
                bgcolor: req.query.bgcolor,
                tips: '没有找到相关信息！',
                backUrl: '/accountant/search'
            });
        }
    });
});

// 更新单个学籍信息
router.post('/update', upload.single('portrait'), (req, res, next) => {
    console.log('/accountant/update');
    var newData = {};
    for(var x in req.body){
        if(x != '_id' && x != 'portrait_url')
            newData[x] = req.body[x];
    }
    if(req.file){
        Curd.findOne(Accountant, {
            _id: req.body._id
        }, (doc)=> {
                var oldFilePath = path.join(__dirname, '../public' + doc.portrait_url);
                Curd.removeFile(oldFilePath);
                Curd.renameFile(req.file, './public/userUploaded/portraits/', 'portrait_acc_' + doc._id, (filePath, fileName)=> {
                    Curd.update(Accountant, {
                        _id: doc._id
                    }, {
                        'portrait_url' : '/userUploaded/portraits/' + fileName
                    });
                });
        });
    }
    Curd.update(Accountant, {
        _id: req.body._id
    }, newData, (doc)=> {
        res.send('<script>window.top.$.tipsShow({code: 0, msg: "修改成功"});window.top.$("#modal_accountant_update").modal("hide");window.top.$("#accountantList").bootstrapTable("refresh");</script>');
    });
});
// 删除单个学籍信息
router.post('/delete', (req, res, next) => {
    console.log('/accountant/delete');
    Curd.remove(Accountant, {
        _id: req.body._id
    }, (doc)=> {
        var portrait_path = path.join(__dirname, '../public' + req.body.portrait_url);
        Curd.removeFile(portrait_path, (doc)=> {
            var sender = new Sender({
                msg: '删除成功'
            }).getData();
            res.send(sender);
        });
    });
});

// 学籍管理页
router.get('/list', (req, res, next) => {
    console.log('/accountant/list');
    res.render('accountant/accountant_list', {title: '学籍管理'});
});
// 学籍列表
router.post('/list/get', (req, res, next) => {
    console.log('/accountant/list/get');
    Curd.getList(Accountant, req.body, {
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
    console.log('/search');
    console.log(req.query);
    var bgcolor = req.query.bgcolor;
    if(bgcolor && bgcolor.indexOf('#') == -1)bgcolor = '#'+bgcolor;
    res.render('accountant/accountant_search', {
        title: '信息查询',
        bgcolor: bgcolor
    });
});

module.exports = router;
