var search = function(){
    var valid = $("#loginForm").formValid({
        errorTips: '缺省搜索条件'
    });
    if(!valid)return;
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