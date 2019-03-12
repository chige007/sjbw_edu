var loginFalse = function(){
    $.tipsShow({
        code:1,
        msg:"用户名或密码错误！"
    });
    $("#loginBtn").text("登　录");
};
$(function(){
    var login = function(){
        var username = $.trim($("#username").val());
        var password = $.trim($("#password").val());
        if(!username){
            $.tipsShow({
                code: 'error',
                msg: '请填写用户名'
            });
            $("#username").setError();
            return;
        }
        if(!password){
            $.tipsShow({
                code: 'error',
                msg: '请填写密码'
            });
            $("#password").setError();
            return;
        }
        $("#loginBtn").text("登录中...");
        $("#loginForm").submit();
    };
    $(document.body).on('keyup', function(e){
        if(e.keyCode == 13)
            login();
    });
    $("#loginBtn").on('click', function(e){
        login();
    });
});