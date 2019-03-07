$(function(){
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
        $(this).removeClass('error');
    });
    $("#page_stuInfoEnter .submit").on('click', function(){
        $("#stuInfoEnterWrap").find('input,select,textarea').each(function(e){
            if(!this.value){
                $(this).addClass('error');
                $.tipsShow({
                    code: 0,
                    msg: '请完善表单'
                })
            }
        });
        $("#stuInfoEnterWrap").submit();
    });
});