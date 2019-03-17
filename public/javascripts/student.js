$(function(){
    // 获取学校列表
    $.myAjax({
        url: '/school/list/get',
        noLoading: true,
        success: function(d){
            for(var i = 0; i < d.rows.length ; i++){
                var selected = "";
                if(i == 0){
                    selected = "selected='selected'";
                    $("#stuInfoEnterWrap [name='graduate_institutions_name']").val(d.rows[i].name);
                }
                $("#stuInfoEnterWrap [name='graduate_institutions']").append("<option value="+d.rows[i].code+" "+ selected +">"+d.rows[i].name+"</option>")
            }

            // 获取学校名称
            $("#stuInfoEnterWrap [name='graduate_institutions']").on('change', function(e){
                var schoolName = $(this).find("[value='"+ this.value +"']").text();
                $("#stuInfoEnterWrap [name='graduate_institutions_name']").val(schoolName);
            });
            
            // 下拉框初始化值
            $("#stuInfoEnterWrap").find("select").each(function(i, e){
                var value = $(this).attr('data-value');
                if(value)
                    $(this).find('[value='+ value +']').prop('selected',true).attr('selected','selected').siblings('option').prop('selected',false).removeAttr('selected');
            });

            // radio初始化值
            $("#stuInfoEnterWrap").find("[type='radio']").each(function(i, e){
                var value = $(this).attr('data-value');
                if(value && value == this.value)
                    $(this).prop('checked',true).attr('checked','checked');
            });
        }
    });
    // 上传头像按钮
    $('#page_stuInfoEnter .fileButton').on('click', function(){
        $(this).siblings('[type="file"]').click();
    });
    // 修改头像按钮
    $('#page_stuInfoEnter .changeFileButton').on('click', function(){
        $(this).siblings('[type="file"]').prop('disabled', false).removeAttr('disabled').click();
    });
    // 选择文件后事件
    $('#page_stuInfoEnter [name="portrait"]').on('change', function(){
        var file = this.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function(e){
            e.target.result;
            $('#page_stuInfoEnter .portrait').attr('src', e.target.result);
        }
    });
    // 取消表单验证提示
    $("#stuInfoEnterWrap").find('input,select,textarea').on('input change', function(){
        $(this).removeError();
    });
    // 提交
    $("#page_stuInfoEnter .submit").on('click', function(){
        // $("#contentWrap").loadingShow();
        var valid = $("#stuInfoEnterWrap").formValid();
        if(!valid)return;
        $("#stuInfoEnterWrap").submit();
    });
});