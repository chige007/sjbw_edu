$(function(){
    $("#modal_school .btn-primary").on('click', function(){
        var form = $("#form_addSchool");
        var _id = $(form).find("[name='_id']").val();
        var code = $(form).find("[name='code']").val();
        var valid = $(form).formValid();
        if(!valid)return;
        if(_id){
            $.myAjax({
                url: '/school/update',
                data: $(form).serialize(),
                success: function(d){
                    if(d.code == 0){
                        $.tipsShow(d);
                        $("#schoolList").bootstrapTable('refresh');
                        $("#modal_school").modal('hide');
                    }
                }
            })
        }else{
            $.myAjax({
                url: '/school/checkCode',
                data: {
                    code: code
                },
                success: function(d){
                    if(d.code == 0){
                        $.myAjax({
                            url: '/school/add',
                            data: $(form).serialize(),
                            success: function(d){
                                if(d.code == 0){
                                    $.tipsShow(d);
                                    $("#schoolList").bootstrapTable('refresh');
                                    $("#modal_school").modal('hide');
                                }
                            }
                        })
                    }else{
                        $.tipsShow(d);
                    }
                }
            })
        }
    });
    $("#modal_school").on('hidden.bs.modal', function(){
        $("#form_addSchool")[0].reset();
        $("#form_addSchool [name='_id']").val('');
        $("#form_addSchool [name='code']").removeAttr('readonly');
    });
    $("#schoolList").initTable({
        // search: true,//是否有关键字查询
        sort : "updateTime",
        order : "desc",
        url: "/school/list/get",
        toolbar: "#toolbar_schoolList",
        columns: [{
            checkbox : true,
            align: 'center',
            valign: 'middle',
            sortable: false//是否允许排序
        },{
            field: '_id',
            title: 'id',
            visible: false,//是否可见
        },{
            field: 'code',
            title: '唯一标识'
        },{
            field: 'name',
            title: '学校名称'
        },{
            field: '_id',
            title: '操作',
            align: 'center',
            width: '90px',
            sortable: false,
            formatter: function(value, row, index){
                return $.getOperateBtn(['update','remove']);//设置操作按钮
            },
            events : {//设置操作按钮事件
                'click .remove': function (e, value, row, index){
                    e.stopPropagation();
                    $.confirmShow({
                        text: '是否确认删除该信息？',
                        confirm: function(){
                            $.myAjax({
                                url: '/school/delete',
                                data: {
                                    _id: value
                                },
                                success: function(d){
                                    $.tipsShow(d);
                                    $("#schoolList").bootstrapTable('refresh');
                                }
                            });
                        }
                    })
                },
                'click .update': function (e, value, row, index){
                    e.stopPropagation();
                    $("#form_addSchool").find('[name]').each(function(i, e){
                        var name = $(this).attr('name');
                        $(this).val(row[name]);
                    });
                    $("#form_addSchool").find('[name="code"]').attr('readonly','readonly');
                    $("#modal_school").modal('show');
                }
            }
        }]
    });
});