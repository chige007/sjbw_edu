var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Sender = require('./../modules/sender');
var User = require('./../models/user');

//连接数据库
mongoose.connect('mongodb://127.0.0.1:27017/sjbw_edu', {useNewUrlParser: true}, (err) => {
    if(err){
        console.log(err);
    }
}); 

/* GET home page. */
router.get('/', (req, res, next) => {
    res.render('login/login', {title: '登录'});
});

router.post('/login', (req, res, next) => {
    var username = req.body.username;
    var password = req.body.password;
    User.countDocuments({
        username: username,
        password: password
    }, (err, count) => {
        if(err){
            console.log(err)
            return;
        }
        if(!count){
            var sender = new Sender({
                code: 1,
                msg: '用户名不存在'
            }).getData();
            res.send(sender);
        }else{
            var sender = new Sender({
                code: 0,
                msg: '登录成功'
            }).getData();
            res.send(sender);
            // console.log(req.session);
            // res.redirect('/index');
        }
        console.log(sender);
    });
});

module.exports = router;
