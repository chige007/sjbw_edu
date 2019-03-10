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
            $("#stuInfoEnterWrap [name='graduate_institutions']").on('change', function(e){
                var schoolName = $(this).find("[value='"+ this.value +"']").text();
                $("#stuInfoEnterWrap [name='graduate_institutions_name']").val(schoolName);
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
        // if(FormData){
        //     var formData = new FormData($("#stuInfoEnterWrap")[0]);
        //     $.myAjax({
        //         url: _id ? '/student/update' : '/student/add',
        //         data: formData,
        //         processData: false,
        //         contentType: false,
        //         success: function(d){
        //             console.log(d);
        //         }
        //     })
        // }else{
            $("#stuInfoEnterWrap").submit();
        // }
    });
});