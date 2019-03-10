$(function(){
    $.myAjax({
        url: '/school/list/get',
        success: function(d){
            for(var i = 0; i < d.rows.length ; i++){
                $("#stuInfoEnterWrap [name='school_code']").append("<option value="+d.rows[i].code+">"+d.rows[i].name+"</option>")
            }
        }
    });
    $('#page_stuInfoEnter .fileButton').on('click', function(){
        $(this).siblings('[type="file"]').click();
    });
    $('#page_stuInfoEnter [name="portrait"]').on('change', function(){
        var file = this.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function(e){
            e.target.result;
            $('#page_stuInfoEnter .portrait').attr('src', e.target.result);
        }
    });
    $("#stuInfoEnterWrap").find('input,select,textarea').on('input change', function(){
        $(this).removeError();
    });
    $("#page_stuInfoEnter .submit").on('click', function(){
        $("#stuInfoEnterWrap").find('input,select,textarea').each(function(e){
            if(!this.value){
                $(this).setError();
                $.tipsShow({
                    code: 0,
                    msg: '请完善表单'
                })
            }
        });
        $("#stuInfoEnterWrap").submit();
    });
});