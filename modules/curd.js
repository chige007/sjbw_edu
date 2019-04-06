var fs = require('fs');

const curd = {
    save (model, data, success, error) {
        var saveData = new model(data);
        saveData.save((err, doc) => {
            if (err) {
                console.log(err);
                if(typeof error == 'function'){
                    error(err);
                }
            } else {
                if(typeof success == 'function'){
                    success(doc);
                }
            }
        });
    },
    update (model, condition, newData, success) {
        model.updateOne(condition, {$set: newData}, (err, doc) => {
            if(err){
                console.log(err);
                if(typeof error == 'function'){
                    error(err);
                }
            }else{
                if(typeof success == 'function'){
                    success(doc);
                }
            }
        });
    },
    findOne (model, condition, success) {
        model.findOne(condition, (err, doc) => {
            if (err) {
                console.log(err);
                if(typeof error == 'function'){
                    error(err);
                }
            } else {
                if(typeof success == 'function'){
                    success(doc);
                }
            }
        });
    },
    count (model, condition, success, error) {
        model.countDocuments(condition, (err, doc) => {
            if (err) {
                console.log(err);
                (typeof error == 'function') && error(err);
            } else {
                (typeof success == 'function') && success(doc);
            }
        });
    },
    remove (model, condition, success, error) {
        model.remove(condition, (err, doc) => {
            if (err) {
                console.log(err);
                if(typeof error == 'function'){
                    error(err);
                }
            } else {
                if(typeof success == 'function'){
                    success(doc);
                }
            }
        });
    },
    getList (model, condition, options, success, error) {
        options = options || {};
        var defaultOpts = {
            offset: 0,
            pageSize: 10,
            sort: 'updateTime',
            order: 'desc'
        }
        defaultOpts = Object.assign(defaultOpts, options);
        var sort = {};
        if(defaultOpts.order == 'asc')
            sort[defaultOpts.sort] = 1;
        else
            sort[defaultOpts.sort] = -1;
        var $and = [];
        for(var x in condition){
            if(x != 'offset' && x != 'limit' && x != 'order' && x != 'sort' && condition[x]){
                let param = {};
                param[x] = new RegExp(condition[x], 'i');
                $and.push(param);
            }
        }
        condition = {};
        if($and.length)
            condition['$and'] = $and;
        var query = model.find(condition);
        query.skip(defaultOpts.offset).limit(defaultOpts.pageSize).sort(sort).exec((err, doc) => {
            if(err){
                console.log(err);
                if(typeof error == 'function'){
                    error(err);
                }
            }else{
                curd.count(model, {}, (count) => {
                    (typeof success == 'function') && success(doc, count);
                });
            }
        });
    },
    removeFile (path, success, error) {
        if(fs.existsSync(path)){
            fs.unlink(path, (err, doc) => {
                if(err){
                    console.log(err);
                    (typeof error == 'function') && error(err);
                }else{
                    (typeof success == 'function') && success(doc);
                }
            });
        }
    },
    renameFile (file, uploadPath, newName, success, error) {
        var tempPath = file.path;
        var ext = '.' + file.originalname.split('.')[1];
        var fileName = newName + ext;
        var filePath = uploadPath + fileName;
        fs.rename(tempPath, filePath, (err,data) => {
            if (err){
                console.log(err);
                (typeof error == 'function') && error(err);
            }else{
                (typeof success == 'function') && success(filePath, fileName);
            }
        });
    }
}
module.exports = curd;