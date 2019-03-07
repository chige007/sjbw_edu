const express = require('express');
const router = express.Router();
const Sender = require('./../modules/sender');
const User = require('./../models/user');

// 登录页
router.get('/', (req, res, next) => {
    res.render('login/login', {title: '登录'});
});

// 登录
router.post('/login', (req, res, next) => {
    var username = req.body.username;
    var password = req.body.password;
    User.countDocuments({
        username: username,
        password: password
    }, (err, count) => {
        if(err){
            console.log(err)
        }else{
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
        }
    });
});

module.exports = router;
