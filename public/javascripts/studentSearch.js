var search = function(){
    var name = $.trim($("#name").val());
    var id_card = $.trim($("#id_card").val());
    if(!name){
        $.tipsShow({
            code: 'error',
            msg: '请填写姓名'
        });
        $("#name").setError();
        return;
    }
    if(!id_card){
        $.tipsShow({
            code: 'error',
            msg: '请填写身份证号'
        });
        $("#id_card").setError();
        return;
    }
    $("#loginBtn").text("查询中...");
    $("#loginForm").submit();
};
$(document.body).on('keyup', function(e){
    if(e.keyCode == 13)
        search();
});
$("#loginBtn").on('click', function(e){
    search();
});