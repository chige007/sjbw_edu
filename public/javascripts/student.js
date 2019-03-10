$(function(){
    $.myAjax({
        url: '/school/list/get',
        success: function(d){
            for(var i = 0; i < d.rows.length ; i++){
                var selected = "";
                if(i == 0){
                    selected = "selected='selected'";
                    $("#stuInfoEnterWrap [name='graduate_institutions_name']").val(d.rows[i].name);
                }
                $("#stuInfoEnterWrap [name='graduate_institutions']").append("<option value="+d.rows[i].code+" "+ selected +">"+d.rows[i].name+"</option>")
            }
            if($("#stuInfoEnterWrap [name='_id']").val()){
                $("#stuInfoEnterWrap [name='graduate_institutions']").on('change', function(e){
                    var schoolName = $(this).find("[value='"+ this.value +"']").text();
                    $("#stuInfoEnterWrap [name='graduate_institutions_name']").val(schoolName);
                });
    
                $("#stuInfoEnterWrap").find("select").each(function(i, e){
                    var value = $(this).attr('data-value');
                    $(this).find('[value='+ value +']').prop('selected',true).attr('selected','selected').siblings('option').prop('selected',false).removeAttr('selected');
                });
            }

            $("#stuInfoEnterWrap").find("[type='radio']").each(function(i, e){
                var value = $(this).attr('data-value');
                if(value == this.value)
                    $(this).prop('checked',true).attr('checked','checked');
            });
        }
    });
    $('#page_stuInfoEnter .fileButton').on('click', function(){
        $(this).siblings('[type="file"]').click();
    });
    $('#page_stuInfoEnter .changeFileButton').on('click', function(){
        $(this).siblings('[type="file"]').prop('disabled', false).removeAttr('disabled').click();
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
        var _id = $("#stuInfoEnterWrap").find("[name='_id']").val();
        var valid = $("#stuInfoEnterWrap").formValid();
        if(!valid)return;
        $("#stuInfoEnterWrap").submit();
    });
});