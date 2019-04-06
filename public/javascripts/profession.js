$(function(){
    // 下拉框初始化值
    $("#proInfoEnterWrap").find("select").each(function(i, e){
        var value = $(this).attr('data-value');
        if(value)
            $(this).find('[value='+ value +']').prop('selected',true).attr('selected','selected').siblings('option').prop('selected',false).removeAttr('selected');
    });
    // radio初始化值
    $("#proInfoEnterWrap").find("[type='radio']").each(function(i, e){
        var value = $(this).attr('data-value');
        if(value && value == this.value)
            $(this).prop('checked',true).attr('checked','checked');
    });
    // 上传头像按钮
    $('#page_proInfoEnter .fileButton').on('click', function(){
        $(this).siblings('[type="file"]').click();
    });
    // 修改头像按钮
    $('#page_proInfoEnter .changeFileButton').on('click', function(){
        $(this).siblings('[type="file"]').prop('disabled', false).removeAttr('disabled').click();
    });
    // 选择文件后事件
    $('#page_proInfoEnter [name="portrait"]').on('change', function(){
        var file = this.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function(e){
            e.target.result;
            $('#page_proInfoEnter .portrait').attr('src', e.target.result);
        }
    });
    // 取消表单验证提示
    $("#proInfoEnterWrap").find('input,select,textcity').on('input change', function(){
        $(this).removeError();
    });
    // 提交
    $("#page_proInfoEnter .submit").on('click', function(){
        // $("#contentWrap").loadingShow();
        var valid = $("#proInfoEnterWrap").formValid();
        if(!valid)return;
        $("#proInfoEnterWrap").submit();
    });
    $("#page_proInfoEnter [name='province']").on('change', function(e){
        var value = e.target.value;
        if(!value)return;
        var city = [];
        $(e.target.children).each(function(i, e){
            if($(e).text() == value){
                city = $(e).data('city');
            }
        });
        $("#page_proInfoEnter [name='city']").empty();
        for(var x in city){
            $("#page_proInfoEnter [name='city']").append('<option value="'+ city[x]['name']+ '">'+ city[x]['name'] +'</option>');
        }
    });
    $("#page_proInfoEnter [name='province']").trigger('change');
});