$(function(){
    // 下拉框初始化值
    $("#accInfoEnterWrap").find("select").each(function(i, e){
        var value = $(this).attr('data-value');
        if(value)
            $(this).find('[value='+ value +']').prop('selected',true).attr('selected','selected').siblings('option').prop('selected',false).removeAttr('selected');
    });
    // radio初始化值
    $("#accInfoEnterWrap").find("[type='radio']").each(function(i, e){
        var value = $(this).attr('data-value');
        if(value && value == this.value)
            $(this).prop('checked',true).attr('checked','checked');
    });
    // 上传头像按钮
    $('#page_accInfoEnter .fileButton').on('click', function(){
        $(this).siblings('[type="file"]').click();
    });
    // 修改头像按钮
    $('#page_accInfoEnter .changeFileButton').on('click', function(){
        $(this).siblings('[type="file"]').prop('disabled', false).removeAttr('disabled').click();
    });
    // 选择文件后事件
    $('#page_accInfoEnter [name="portrait"]').on('change', function(){
        var file = this.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function(e){
            e.target.result;
            $('#page_accInfoEnter .portrait').attr('src', e.target.result);
        }
    });
    // 取消表单验证提示
    $("#accInfoEnterWrap").find('input,select,textarea').on('input change', function(){
        $(this).removeError();
    });
    // 提交
    $("#page_accInfoEnter .submit").on('click', function(){
        // $("#contentWrap").loadingShow();
        var valid = $("#accInfoEnterWrap").formValid();
        if(!valid)return;
        $("#accInfoEnterWrap").submit();
    });
    $("#page_accInfoEnter [name='city']").on('change', function(e){
        var value = e.target.value;
        if(!value)return;
        var area = [];
        $(e.target.children).each(function(i, e){
            if($(e).text() == value){
                area = $(e).data('area');
            }
        });
        $("#page_accInfoEnter [name='area']").empty();
        for(var x in area){
            $("#page_accInfoEnter [name='area']").append('<option value="'+ area[x]+ '">'+ area[x] +'</option>');
        }
    });
    $("#page_accInfoEnter [name='city']").trigger('change');
});