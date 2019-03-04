var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/enter', function(req, res, next) {
    res.render('stu_info_service/stu_info_enter', {title: '信息录入'});
});

module.exports = router;
