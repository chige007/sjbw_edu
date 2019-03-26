$(function(){
    $("#report_template .save").on('click', function(e){
        $("#form_report_config").submit();
    });
    $("#report_template .preview").on('click', function(e){
        $("#iframe_template").contents().find("body").focus().print({
            globalStyles: false,
            mediaPrint: false,
            iframe: false,
            debug: false,  //是否显示iframe查看效果
            importCSS: false,
            printContainer: true,
            operaSupport: false
        });
    })
});