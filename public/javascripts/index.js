$(function(){
    $("#menuBar li").on('click', function(){
        var url = $(this).attr('data-url');
        $("#contentWrap").load(url, function(d){
            console.log(d);
        });
        $(this).siblings('li').removeClass('active');
        $(this).addClass('active');
    });
});