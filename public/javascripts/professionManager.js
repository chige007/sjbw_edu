$(function(){
    $("#modal_profession_check").on('hidden.bs.modal', function(){
        $(this).find('.modal-body').empty();
    });
    $("#modal_profession_update").on('hidden.bs.modal', function(){
        $(this).find('.modal-body').empty();
    });
    $('#professionList').initTable({
        // search: true,//是否有关键字查询
        sort : 'updateTime',
        order : 'desc',
        url: '/profession/list/get',
        toolbar: '#toolbar_professionList',
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
            field: 'id_card',
            title: '证件号码'
        },{
            field: 'province',
            title: '籍贯',
            formatter: function(value, row, index){
                return value + row.city;
            }
        },{
            field: 'birthday',
            title: '出生日期'
        },{
            field: 'major',
            title: '专业名称'
        },{
            field: 'certificate_num',
            title: '证书编号'
        },{
            field: 'qualification_level',
            title: '资格级别'
        },{
            field: 'certification_date',
            title: '发证时间'
        },{
            field: 'company_name',
            title: '单位名称'
        },{
            field: 'theory_score',
            title: '理论知识考试成绩'
        },{
            field: 'practice_score',
            title: '实践技能考试成绩'
        },{
            field: 'comprehensive_score',
            title: '综合评审成绩'
        },{
            field: 'evaluate_score',
            title: '评定成绩'
        },{
            field: '_id',
            title: '操作',
            align: 'center',
            width: '100px',
            sortable: false,
            formatter: function(value, row, index){
                var buttons = $.getOperateBtn(['update','check','remove']);
                return buttons;//设置操作按钮
            },
            events : {//设置操作按钮事件
                'click .remove': function (e, value, row, index){
                    e.stopPropagation();
                    $.confirmShow({
                        text: '是否确认删除该信息？',
                        confirm: function(){
                            $.myAjax({
                                url: '/profession/delete',
                                data: {
                                    _id: value,
                                    portrait_url: row.portrait_url
                                },
                                success: function(d){
                                    $.tipsShow(d);
                                    $('#professionList').bootstrapTable('refresh');
                                }
                            });
                        }
                    })
                },
                'click .check' : function(e, value, row, index){
                    e.stopPropagation();
                    $('#modal_profession_check').modal('show').find('.modal-body').loadingShow().load('/profession/get?hasBack=0', {'_id': value});
                },
                'click .update': function (e, value, row, index){
                    e.stopPropagation();
                    $('#modal_profession_update').modal('show').find('.modal-body').loadingShow().load('/profession/add', {'_id': value});
                }
            }
        }]
    });
});