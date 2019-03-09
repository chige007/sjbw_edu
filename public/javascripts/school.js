$(function(){
    $("#modal_school .btn-primary").on('click', function(){
        var form = $("#form_addSchool");
        var code = $(form).find("[name='code']").val();
        var valid = $(form).formValid();
        if(!valid)return;
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
    });
    $("#modal_school").on('hidden.bs.modal', function(){
        $("#form_addSchool")[0].reset();
    });
    $("#schoolList").initTable({
        search: true,//是否有关键字查询
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
            field: 'id',
            title: 'id',
            visible: false,//是否可见
        },{
            field: 'code',
            title: '唯一标识'
        },{
            field: 'name',
            title: '学校名称'
        },{
            field: '',
            title: '操作'
        }]
    });
});