const express = require('express');
const router = express.Router();
// const Sender = require('./../modules/sender');
const User = require('./../models/user');

// 登录页
router.get('/', (req, res, next) => {
    console.log(req.body);
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
                res.send('<script>window.top.loginFalse();</script>');
            }else{
                req.session.username = username;
                res.send('<script>window.top.location.href="/"</script>');
            }
        }
    });
});
router.get('/logout', (req, res, next) => {
    req.session.destroy(function(err) {
        if(err){
            console.log(err);
            return;
        }
        res.clearCookie('sjbw_session');
        res.redirect('/login');
    });
});

module.exports = router;
