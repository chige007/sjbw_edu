var express = require('express');
var router = express.Router();
var path = require('path');
var multer  = require('multer');
const Sender = require('./../modules/sender');
const Profession = require('./../models/profession');
const China = require('./../modules/china');
const Curd = require('./../modules/curd');

var upload = multer({ dest: path.join(__dirname, '../public/userUploaded/portraits')});

var selectOptions = {
    continuing_edu_year: [],
    china: China
}

// 信息录入页
router.get('/add', (req, res, next) => {
    res.render('profession/add', {
        title: '信息录入',
        professionInfo: {},
        selectOptions: selectOptions
    });
});
router.post('/add', (req, res, next) => {
    Curd.findOne(Profession, req.body, (doc)=> {
        res.render('profession/add', {
            title: '信息查询',
            professionInfo: doc,
            selectOptions: selectOptions
        });
    });
});
// 信息保存
router.post('/save', upload.single('portrait'), (req, res, next) => {
    console.log('/profession/add');
    var successScript = '<script>window.top.$("#contentWrap").load("/add/success?addUrl=/pro?tab=/profession/add&listUrl=/pro?tab=/profession/list");</script>';
    Curd.save(Profession, req.body, (doc)=> {
        var portrait = req.file;
        if(portrait){
            Curd.renameFile(portrait, './public/userUploaded/portraits/', 'portrait_pro_' + doc._id, (filePath, fileName)=> {
                Curd.update(Profession, {
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
// 获取单个信息
router.post('/get', (req, res, next) => {
    console.log('/profession/get');
    Curd.findOne(Profession, req.body, (doc) => {
        if(doc){
            doc._idMask = new Buffer(doc._id + '').toString('base64');
            res.render('profession/check', {
                title: '信息查询',
                professionInfo: doc,
                hasBack: req.query.hasBack,
                bgcolor: req.query.bgcolor
            });
        }else{
            res.render('common/search_none', {
                bgcolor: req.query.bgcolor,
                tips: '没有找到相关信息！',
                backUrl: '/profession/search'
            });
        }
    });
});

// 更新单个信息
router.post('/update', upload.single('portrait'), (req, res, next) => {
    console.log('/profession/update');
    var newData = {};
    for(var x in req.body){
        if(x != '_id' && x != 'portrait_url')
            newData[x] = req.body[x];
    }
    if(req.file){
        Curd.findOne(Profession, {
            _id: req.body._id
        }, (doc)=> {
                var oldFilePath = path.join(__dirname, '../public' + doc.portrait_url);
                Curd.removeFile(oldFilePath);
                Curd.renameFile(req.file, './public/userUploaded/portraits/', 'portrait_pro_' + doc._id, (filePath, fileName)=> {
                    Curd.update(Profession, {
                        _id: doc._id
                    }, {
                        'portrait_url' : '/userUploaded/portraits/' + fileName
                    });
                });
        });
    }
    Curd.update(Profession, {
        _id: req.body._id
    }, newData, (doc)=> {
        res.send('<script>window.top.$.tipsShow({code: 0, msg: "修改成功"});window.top.$("#modal_profession_update").modal("hide");window.top.$("#professionList").bootstrapTable("refresh");</script>');
    });
});
// 删除单个信息
router.post('/delete', (req, res, next) => {
    console.log('/profession/delete');
    Curd.remove(Profession, {
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

// 管理页
router.get('/list', (req, res, next) => {
    console.log('/profession/list');
    res.render('profession/list', {title: '管理'});
});
// 列表
router.post('/list/get', (req, res, next) => {
    console.log('/profession/list/get');
    Curd.getList(Profession, req.body, {
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
// 信息查询页
router.get('/search', (req, res, next) => {
    console.log('/search');
    console.log(req.query);
    var bgcolor = req.query.bgcolor;
    if(bgcolor && bgcolor.indexOf('#') == -1)bgcolor = '#'+bgcolor;
    res.render('profession/search', {
        title: '信息查询',
        bgcolor: bgcolor
    });
});

module.exports = router;
