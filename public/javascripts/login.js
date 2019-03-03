$(function(){
    $("#loginBtn").on('click', function(e){
        var username = $.trim($("#username").val());
        var password = $.trim($("#password").val());
        if(!username){
            $.tipsShow({
                msg: '请填写用户名'
            });
            $("#username").setError();
            return;
        }
        if(!password){
            $.tipsShow({
                msg: '请填写密码'
            });
            $("#password").setError();
            return;
        }
        $.myAjax({
            url: '/login/login',
            data: {
                username: username,
                password: password
            },
            type: 'post',
            beforeSend: function(){
                $("#loginBtn").text("登录中...");
            },
            noLoading: true,
            success: function(d){
                $("#loginBtn").text("登　录");
                $.tipsShow(d);
                if(d.code == '0'){
                    window.location.href = '/index';
                }
            },
            error: function(){
                $("#loginBtn").text("登　录");
            }
        })
    });
});