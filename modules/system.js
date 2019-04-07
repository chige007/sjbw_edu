const Curd = require('./../modules/curd');
const System = require('./../models/system');

var config = {};

module.exports = {
    get (callback) {
        if(config._id){
            callback && callback(config)
        }else{
            Curd.findOne(System, {
                _id: 'systemConfig'
            }, (doc)=> {
                config = doc;
                callback && callback(doc);
            });
        }
    },
    reset () {
        config = {};
    }
};