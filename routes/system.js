var express = require('express');
var router = express.Router();
const Sender = require('./../modules/sender');
const Curd = require('./../modules/curd');
const System = require('./../models/system');
const config = require('./../modules/system');

router.post('/save', function(req, res, next) {
    Curd.save(System, req.body, (doc)=> {
        var sender = new Sender().getData();
        config.reset();
        res.send(sender);
    });
});
router.post('/update', function(req, res, next) {
    Curd.update(System,{
        _id: 'systemConfig'
    } , req.body, (doc)=> {
        var sender = new Sender().getData();
        config.reset();
        res.send(sender);
    });
});

module.exports = router;
