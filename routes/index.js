var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {title: '首页'});
});

router.get('/index', function(req, res, next) {
    console.log('#######');
    res.render('index', {title: '首页'});
});

module.exports = router;
