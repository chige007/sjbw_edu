const express = require('express');
const router = express.Router();
const Curd = require('./../modules/curd');
const User = require('./../models/user');

// 登录页
router.get('/', (req, res, next) => {
    console.log('get:/login');
    res.render('login/login', {title: '登录'});
});

// 登录
router.post('/login', (req, res, next) => {
    console.log('post:/login/login');
    var username = req.body.username;
    var password = req.body.password;
    var condition = {
        username,
        password
    }
    Curd.count(User, condition, (doc) => {
        console.log(doc);
        if(!doc){
            res.send('<script>window.top.loginFalse();</script>');
        }else{
            req.session.username = username;
            res.send('<script>window.top.location.href="/"</script>');
        }
    });
});
router.get('/logout', (req, res, next) => {
    req.session.destroy(function(err) {
        if(err){
            res.send(err)
        }
        res.clearCookie('sjbw_session');
        res.redirect('/login');
    });
});

module.exports = router;
