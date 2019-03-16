$(function(){
    $("#menuBar .list-group-item").on('click', function(){
        var url = $(this).attr('data-url');
        $("#contentWrap").loadingShow('full').load(url, function(d){});
        $(this).siblings('.list-group-item').removeClass('active');
        $(this).addClass('active');
    });
    (function(){
        var href = window.location.href;
        var tabName = href.split('?tab=')[1];
        $("#menuBar .list-group-item[data-url='"+ tabName +"']").click();
    })();
});