var express = require('express');
var router = express.Router();
const Curd = require('./../modules/curd');
const System = require('./../models/system');

/* 首页 */
router.get('/', function(req, res, next) {
    console.log(req.session.username + '进入首页');
    if(req.session.username){
        res.render('index', {
            title: '首页',
            username: req.session.username
        });
    }else{
        res.redirect("/login");
    }
});
/* 首页 - 会计 */
router.get('/acc', function(req, res, next) {
    console.log(req.session.username + '进入首页');
    if(req.session.username){
        res.render('index_accountant', {
            title: '首页',
            username: req.session.username
        });
    }else{
        res.redirect("/login");
    }
});
/* 首页 - 职业技能人才 */
router.get('/pro', function(req, res, next) {
    console.log(req.session.username + '进入首页');
    if(req.session.username){
        res.render('index_profession', {
            title: '首页',
            username: req.session.username
        });
    }else{
        res.redirect("/login");
    }
});
/* 首页 - 系统设置 */
router.get('/sys', function(req, res, next) {
    console.log(req.session.username + '进入首页');
    if(req.session.username){
        Curd.findOne(System, {
            _id: 'systemConfig'
        }, (doc)=> {
            doc = doc || {};
            res.render('system', {
                title: '系统设置',
                username: req.session.username,
                systemConfig: doc
            });
        });
    }else{
        res.redirect("/login");
    }
});
/* 添加成功 */
router.get('/add/success', function(req, res, next) {
    console.log('/add/success');
    console.log(req.query);
    res.render('common/add_success', {
        listUrl: req.query.listUrl,
        addUrl: req.query.addUrl
    });
});

module.exports = router;
