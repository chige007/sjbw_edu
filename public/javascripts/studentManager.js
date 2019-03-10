$(function(){
    $("#studentList").initTable({
        search: true,//是否有关键字查询
        sort : "updateTime",
        order : "desc",
        url: "/student/list/get",
        toolbar: "#toolbar_studentList",
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
            field: 'name',
            title: '姓名'
        },{
            field: 'sex',
            title: '性别'
        },{
            field: 'birthday',
            title: '出生日期'
        },{
            field: 'graduate_institutions',
            title: '毕业院校'
        },{
            field: 'education_type',
            title: '专业'
        },{
            field: 'edu_level',
            title: '学历层次'
        },{
            field: 'edu_type',
            title: '学习形式'
        },{
            field: 'certificate_num',
            title: '证书编号'
        },{
            field: 'admission_date',
            title: '入学时间'
        },{
            field: 'edu_conclusion',
            title: '毕结业结论'
        },{
            field: 'graduation_date',
            title: '毕业时间'
        },{
            field: '_id',
            title: '操作',
            align: 'center',
            width: '110px',
            sortable: false,
            formatter: function(value, row, index){
                return $.getOperateBtn(['update','check','remove']);//设置操作按钮
            },
            events : {//设置操作按钮事件
                'click .remove': function (e, value, row, index){
                    e.stopPropagation();
                    $.myAjax({
                        url: '/student/delete',
                        data: {
                            _id: value
                        },
                        success: function(d){
                            $.tipsShow(d);
                            $("#schoolList").bootstrapTable('refresh');
                        }
                    });
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