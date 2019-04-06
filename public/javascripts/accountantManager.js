$(function(){
    $("#modal_accountant_check").on('hidden.bs.modal', function(){
        $(this).find('.modal-body').empty();
    });
    $("#modal_accountant_update").on('hidden.bs.modal', function(){
        $(this).find('.modal-body').empty();
    });
    $('#accountantList').initTable({
        // search: true,//是否有关键字查询
        sort : 'updateTime',
        order : 'desc',
        url: '/accountant/list/get',
        toolbar: '#toolbar_accountantList',
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
            title: '身份证号'
        },{
            field: 'city',
            title: '行政区划',
            formatter: function(value, row, index){
                return value + '/' + row.area;
            }
        },{
            field: 'qualification_level',
            title: '资格级别'
        },{
            field: 'qualification_getType',
            title: '取得方式'
        },{
            field: 'certification_date',
            title: '发证日期'
        },{
            field: 'continuing_edu_year',
            title: '继续教育年度'
        },{
            field: 'training_unit',
            title: '培训单位'
        },{
            field: 'training_date',
            title: '培训日期'
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
                                url: '/accountant/delete',
                                data: {
                                    _id: value,
                                    portrait_url: row.portrait_url
                                },
                                success: function(d){
                                    $.tipsShow(d);
                                    $('#accountantList').bootstrapTable('refresh');
                                }
                            });
                        }
                    })
                },
                'click .check' : function(e, value, row, index){
                    e.stopPropagation();
                    $('#modal_accountant_check').modal('show').find('.modal-body').loadingShow().load('/accountant/get?hasBack=0', {'_id': value});
                },
                'click .update': function (e, value, row, index){
                    e.stopPropagation();
                    $('#modal_accountant_update').modal('show').find('.modal-body').loadingShow().load('/accountant/add', {'_id': value});
                }
            }
        }]
    });
});