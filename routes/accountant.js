var express = require('express');
var router = express.Router();
var path = require('path');
var multer  = require('multer');
const Sender = require('./../modules/sender');
const Accountant = require('./../models/accountant');
const China = require('./../modules/china');
const Curd = require('./../modules/curd');
const systemConfig = require('./../modules/system');

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
    res.render('accountant/add', {
        title: '信息录入',
        accountantInfo: {},
        selectOptions: selectOptions
    });
});
router.post('/add', (req, res, next) => {
    Curd.findOne(Accountant, req.body, (doc)=> {
        res.render('accountant/add', {
            title: '信息查询',
            accountantInfo: doc,
            selectOptions: selectOptions
        });
    });
});
// 信息保存
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
// 获取单个信息
router.post('/get', (req, res, next) => {
    console.log('/accountant/get');
    Curd.findOne(Accountant, req.body, (doc) => {
        if(doc){
            // var waterMaskCss = [];
            // var waterMaskCss_start_top = 90;
            // var waterMaskCss_start_left = 10;
            // for(var t = 0 ; t < 6 ; t++){
            //     for(var l = 0 ; l < 6 ; l++){
            //         waterMaskCss.push([waterMaskCss_start_top, waterMaskCss_start_left]);
            //         waterMaskCss_start_left += 400;
            //     }
            //     waterMaskCss_start_top += 220;
            //     waterMaskCss_start_left = 10;
            // }
            doc._idMask = new Buffer(doc._id + '').toString('base64');

            systemConfig.get((sysConfig)=>{
                res.render('accountant/check', {
                    title: '信息查询',
                    accountantInfo: doc,
                    hasBack: req.query.hasBack,
                    bgcolor: req.query.bgcolor,
                    // waterMaskCss: waterMaskCss,
                    sysConfig
                });
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

// 更新单个信息
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
// 删除单个信息
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

// 管理页
router.get('/list', (req, res, next) => {
    console.log('/accountant/list');
    res.render('accountant/list', {title: '管理'});
});
// 列表
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
// 信息查询页
router.get('/search', (req, res, next) => {
    console.log('/search');
    console.log(req.query);
    var bgcolor = req.query.bgcolor;
    if(bgcolor && bgcolor.indexOf('#') == -1)bgcolor = '#'+bgcolor;
    systemConfig.get((sysConfig)=>{
        res.render('accountant/search', {
            title: '信息查询',
            bgcolor: bgcolor,
            sysConfig
        });
    });
});

module.exports = router;
