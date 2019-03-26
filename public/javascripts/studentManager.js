$(function(){
    $('#modal_student_check .report').on('click', function(){
        $("#modal_student_report").modal('show');
        if($("#form_student_print"))
            $("#form_student_print").submit();
    });
    $('#modal_student_report .print').on('click', function(){
        $("#iframe_student_report").contents().find("body").focus().print({
            globalStyles: false,
            mediaPrint: false,
            iframe: false,
            debug: false,  //是否显示iframe查看效果
            importCSS: false,
            printContainer: true,
            operaSupport: false
        });
    });
    $('#modal_student_report .download').on('click', function(){
        $("#iframe_student_report").contents().scrollTop(0);
        var pdf = new jsPDF('p', 'mm', 'a4'); 
        var print_content = $("#iframe_student_report").contents().find("#student_print"); 
        var filename = $('#modal_student_report').find('.modal-header .modal-title').text() + '.pdf'; 

        pdf.addHTML(print_content, function(){
            pdf.output("save", filename)
        })
    });

    $('#modal_student_report .printQrcode').on('click', function(){
        $("#iframe_student_report").contents().find("#student_print").addClass("onlyQrcode");
        $("#iframe_student_report").contents().find("body").focus().print({
            globalStyles: false,
            mediaPrint: false,
            iframe: false,
            debug: false,  //是否显示iframe查看效果
            importCSS: false,
            printContainer: true,
            operaSupport: false
        });
        $("#iframe_student_report").contents().find("#student_print").removeClass("onlyQrcode");
    });

    $("#modal_student_report").on('hidden.bs.modal', function(){
        $(this).find('.print').attr('disabled', 'disabled');
        $(this).find('.download').attr('disabled', 'disabled');
        $(this).find('.modal-header .modal-title').text('认证报告');
    });
    $("#modal_student_check").on('hidden.bs.modal', function(){
        $(this).find('.modal-body').empty();
    });
    $("#modal_student_update").on('hidden.bs.modal', function(){
        $(this).find('.modal-body').empty();
    });

    $('#studentList').initTable({
        // search: true,//是否有关键字查询
        sort : 'updateTime',
        order : 'desc',
        url: '/student/list/get',
        toolbar: '#toolbar_studentList',
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
            field: 'graduate_institutions_name',
            title: '毕业院校'
        },{
            field: 'education_type',
            title: '专业'
        },{
            field: 'edu_level',
            title: '学历'
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
            title: '毕结业'
        },{
            field: 'graduation_date',
            title: '毕业时间'
        },{
            field: '_id',
            title: '操作',
            align: 'center',
            width: '150px',
            sortable: false,
            formatter: function(value, row, index){
                var buttons = $.getOperateBtn(['update','check','remove']);
                buttons = '<i class="operateBtn report glyphicon glyphicon-list-alt" title="认证报告" data-toggle="tooltip"></i>' + buttons;
                // buttons = '<i class="operateBtn printQrcode glyphicon glyphicon-print" title="打印二维码" data-toggle="tooltip"></i>' + buttons;
                buttons = '<i class="operateBtn getQrcode glyphicon glyphicon-qrcode" title="获取二维码" data-toggle="tooltip"></i>' + buttons;
                return buttons;//设置操作按钮
            },
            events : {//设置操作按钮事件
                'click .remove': function (e, value, row, index){
                    e.stopPropagation();
                    $.confirmShow({
                        text: '是否确认删除该信息？',
                        confirm: function(){
                            $.myAjax({
                                url: '/student/delete',
                                data: {
                                    _id: value,
                                    portrait_url: row.portrait_url
                                },
                                success: function(d){
                                    $.tipsShow(d);
                                    $('#studentList').bootstrapTable('refresh');
                                }
                            });
                        }
                    })
                },
                'click .check' : function(e, value, row, index){
                    e.stopPropagation();
                    $('#modal_student_check').modal('show').find('.modal-body').loadingShow().load('/student/get', {'_id': value, 'hasBack': '0'});
                },
                'click .update': function (e, value, row, index){
                    e.stopPropagation();
                    $('#modal_student_update').modal('show').find('.modal-body').loadingShow().load('/student', {'_id': value});
                },
                // 'click .printQrcode': function (e, value, row, index){
                //     e.stopPropagation();
                // },
                'click .getQrcode': function (e, value, row, index){
                    e.stopPropagation();
                    window.open('/student/getQrcode/' + value)
                },
                'click .report' : function(e, value, row, index){
                    e.stopPropagation();
                    $('#modal_student_report').modal('show').find('.modal-header .modal-title').text(row.name + '认证报告');
                    $("#form_student_print").find('[name="_id"]').val(value);
                    if($("#form_student_print"))
                        $("#form_student_print").submit();
                }
            }
        }]
    });
});