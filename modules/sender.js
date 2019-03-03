function Sender(options){
    var code = options.code || 0;
    var msg = options.msg || "操作成功";
    var data = options.data || {};

    this.setCode = function(code){
        code = code;
        return this;
    };
    this.setMsg = function(msg){
        msg = msg;
        return this;
    };
    this.setData = function(data){
        data = data;
        return this;
    };
    this.getData = function(){
        return {
            code: code,
            msg: msg,
            data: data
        }
    }
}
module.exports = Sender;