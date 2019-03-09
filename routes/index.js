var express = require('express');
var router = express.Router();

/* GET home page. */
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

module.exports = router;
