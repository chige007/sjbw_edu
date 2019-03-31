var express = require('express');
var router = express.Router();
const China = require('./../modules/china');

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

module.exports = router;
