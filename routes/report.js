var express = require('express');
var router = express.Router();

// 学籍信息录入页
router.get('/template', (req, res, next) => {
    res.render('report/template', {
        title: '打印模板',
        studentInfo: {
            report_code: 'XXXXXXX',
            name: 'XXX',
            sex: 'X',
            print_date: 'XXXX-XX-XX'
        }
    });
});

module.exports = router;
