var T_TIPS = null;
$(function(){
    $.extend({
        myAjax: function(options){
            var defaultOpts = {
                dataType: 'json',
                type: 'post',
                beforeSend: function(){  
                    if(options.loadWrap && !options.noLoading){
                        $(options.loadWrap).loadingShow();
                    }else if(!options.noLoading){
                        $.loadingShow();
                    }
                },
                success: function(d){
                    if(options.loadWrap){
                        $(options.loadWrap).loadingShow();
                    }else{
                        $.loadingShow();
                    }
                }
            };
            $.extend(true, defaultOpts, options);
            $.ajax(defaultOpts);
        },
        loadingShow: function(){
            console.log('loadingShow');
        },
        loadingHide: function(){
            console.log('loadingShow');
        },
        tipsShow: function(msgObj){
            msgObj = msgObj || {};
            var tipsBox = $('#global_simpleTips');
            var box = $(tipsBox).find('.box');
            $(box).text(msgObj.msg);
            var boxClass = '';
            if(msgObj.code == 0 || msgObj.code == 'success'){
                boxClass = 'success';
            }else if(msgObj.code == 1 || msgObj.code == 'error'){
                boxClass = 'error';
            }else if(msgObj.code == 'warn'){
                boxClass = 'warn';
            }
            $(box).addClass(boxClass);
            $(tipsBox).addClass('show');
            T_TIPS = setTimeout(function(){
                $.tipsHide();
            }, 3000);
        },
        tipsHide: function(){
            clearTimeout(T_TIPS);
            var tipsBox = $('#global_simpleTips');
            $(tipsBox).removeClass('show');
        }
    });

    $.fn.extend({
        loadingShow: function(){
            console.log('loadingShow');
        },
        loadingHide: function(){
            console.log('loadingShow');
        },
        setError: function(){
            $(this).addClass('error');
        }
    });

    $('#global_simpleTips').on('click', function(){
        $.tipsHide();
    });
    $('input,select,textarea').on('input change', function(){
        $(this).removeClass('error');
    });
});