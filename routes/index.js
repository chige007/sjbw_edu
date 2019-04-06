var express = require('express');
var router = express.Router();

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
