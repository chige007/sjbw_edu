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
            var tipsBox = $('#topTips');
            $(tipsBox).find('span').text(msgObj.msg);
            var boxClass = 'alert-info';
            if(msgObj.code == 0 || msgObj.code == 'success'){
                boxClass = 'alert-success';
            }else if(msgObj.code == 1 || msgObj.code == 'error'){
                boxClass = 'alert-danger';
            }else if(msgObj.code == 'warn'){
                boxClass = 'alert-warning';
            }
            $(tipsBox).addClass(boxClass + ' show');
            T_TIPS = setTimeout(function(){
                $.tipsHide();
            }, 3000);
        },
        tipsHide: function(){
            clearTimeout(T_TIPS);
            var tipsBox = $('#topTips');
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
            $(this).closest('.form-group').addClass('has-error');
        },
        removeError: function(){
            $(this).closest('.form-group').removeClass('has-error');
        },
        initTable: function(options){
            options = options || {};
            var defaultOpts = {
                url: "",
                sendData: options.sendData || {},
                method:'POST',
                dataType:'json',
                contentType: "application/x-www-form-urlencoded",
                cache: false,
                striped: true,
                searchOnEnterKey: true,
                checkboxHeader: true,
                sortable: true,
                sidePagination: "server",
                // dataField: "data['rows']",
                sortName: options.sort || "updateTime",
                sortOrder: options.order || "desc",
                uniqueId: "id",
                pagination: true,
                pageNumber: 1,
                pageSize: 10,
                clickToSelect: true
            }
            $.extend(true,defaultOpts,options);
            $(this).on("load-success.bs.table",function(){
                // $(this).find("[data-toggle='tooltip']").initToolTips();
            });
            $(this).bootstrapTable(defaultOpts);
        },
        formValid: function(){
            var flag = true;
            $(this).find('input,select,textarea').each(function(e){
                if(!this.value){
                    $(this).setError();
                    $.tipsShow({
                        code: 1,
                        msg: '请完善表单'
                    })
                    flag = false;
                }
            });
            return flag;
        }
    });

    $('input,select,textarea').on('input change', function(){
        $(this).removeError();
    });
});