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
                        $('body').loadingShow();
                    }
                },
                success: function(d){
                    if(options.loadWrap){
                        $(options.loadWrap).loadingShow();
                    }else{
                        $('body').loadingShow();
                    }
                }
            };
            $.extend(true, defaultOpts, options);
            $.ajax(defaultOpts);
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
            $(tipsBox).removeClass("alert-info alert-success alert-danger alert-warning")
            $(tipsBox).addClass(boxClass + ' show');
            T_TIPS = setTimeout(function(){
                $.tipsHide();
            }, 3000);
        },
        tipsHide: function(){
            clearTimeout(T_TIPS);
            var tipsBox = $('#topTips');
            $(tipsBox).removeClass('show');
        },
        confirmShow: function(options){
            var box = $('#confirmBox');
            var defaultOpts = {
                title: '系统提示',
                text: '？',
                confirm: $.noop,
                cancel: function(){
                    $.confirmHide();
                }
            }
            $.extend(defaultOpts, options);
            $(box).find('.modal-title').text(options.title);
            $(box).find('.modal-body .text').text(options.text);
            $(box).find('.modal-footer .cancel').off('click').on('click', defaultOpts.cancel);
            $(box).find('.modal-footer .confirm').off('click').on('click', defaultOpts.confirm);
            $('#confirmBox').modal('show');
        },
        confirmHide: function(){
            $('#confirmBox').modal('hide');
        },
        getOperateBtn: function(btnArray,btnTips){//获取表格行工具按钮
            btnArray = btnArray || [];
            btnTips = btnTips || [];
            var btnsStr = "";
            if($.inArray('publish',btnArray) != -1){
                btnsStr += '<i class="operateBtn publish glyphicon glyphicon-ok" data-toggle="tooltip" title="'+(btnTips[$.inArray("publish",btnArray)] || "发布")+'"></i>';
            }
            if($.inArray('noPublish',btnArray) != -1){
                btnsStr += '<i class="operateBtn noPublish glyphicon glyphicon-ban-circle" data-toggle="tooltip" title="'+(btnTips[$.inArray("noPublish",btnArray)] || "撤销发布")+'"></i>';
            }
            if($.inArray('check',btnArray) != -1){
                btnsStr += '<i class="operateBtn check glyphicon glyphicon-search" data-toggle="tooltip" title="'+(btnTips[$.inArray("check",btnArray)] || "查看")+'"></i>';
            }
            if($.inArray('update',btnArray) != -1){
                btnsStr += '<i class="operateBtn update glyphicon glyphicon-pencil" data-toggle="tooltip" title="'+(btnTips[$.inArray("update",btnArray)] || "编辑")+'"></i>';
            }
            if($.inArray('compare',btnArray) != -1){
                btnsStr += '<i class="operateBtn compare iconfont icon-daimatuoguan f-16" data-toggle="tooltip" title="'+(btnTips[$.inArray("compare",btnArray)] || "对比")+'"></i>';
            }
            if($.inArray('upload',btnArray) != -1){
                btnsStr += '<i class="operateBtn upload glyphicon glyphicon glyphicon-open" data-toggle="tooltip" title="'+(btnTips[$.inArray("upload",btnArray)] || "上传")+'"></i>';
            }
            if($.inArray('download',btnArray) != -1){
                btnsStr += '<i class="operateBtn download glyphicon glyphicon-download-alt" data-toggle="tooltip" title="'+(btnTips[$.inArray("download",btnArray)] || "下载")+'"></i>';
            }
            if($.inArray('list',btnArray) != -1){
                btnsStr += '<i class="operateBtn list glyphicon glyphicon-th-list" data-toggle="tooltip" title=""'+(btnTips[$.inArray("list",btnArray)] || "查看详情")+'"></i>';
            }
            if($.inArray('remove',btnArray) != -1){
                btnsStr += '<i class="operateBtn remove glyphicon glyphicon-trash" data-toggle="tooltip" title="'+(btnTips[$.inArray("remove",btnArray)] || "删除")+'"></i>';
            }
            return btnsStr;
        }
    });

    $.fn.extend({
        loadingShow: function(extendsClass){
            return $(this).append('<div class="loadingWrap '+ extendsClass +'"><img src="/images/loading-min.gif"/></div>');
        },
        loadingHide: function(){
            return $(this).find('.loadingWrap').remove();
        },
        setError: function(){
            return $(this).closest('.form-group').addClass('has-error');
        },
        removeError: function(){
            return $(this).closest('.form-group').removeClass('has-error');
        },
        initToolTips: function(options){
            return $(this).tooltip(options);
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
                var table = this;
                $(table).find("[data-toggle='tooltip']").initToolTips();
                var toolbar = $(table).bootstrapTable('getOptions').toolbar;
                $(toolbar).find('.searchBtn').off('click').on('click', function(){
                    var form = $(this).closest('form').eq(0);
                    var params = {};
                    $(form).find('[name]').each(function(i, e){
                        params[$(this).attr('name')] = $(this).val();
                    });
                    $(table).bootstrapTable('refresh', {
                        query: params
                    });
                });
            });
            return $(this).bootstrapTable(defaultOpts);
        },
        formValid: function(){
            var flag = true;
            $(this).find('input,select,textarea').each(function(e){
                if(!this.value && !$(this).attr('novalid') && !$(this).prop('disabled')){
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